"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../lib/prisma");
const stripe_1 = require("../lib/stripe");
const config_1 = require("../config");
exports.checkoutRouter = (0, express_1.Router)();
// Zod schemas for checkout request
const checkoutSchema = zod_1.z.object({
    planId: zod_1.z.string(),
    billingCycle: zod_1.z.enum(['monthly', 'quarterly', 'annual'])
});
exports.checkoutRouter.use(auth_1.authenticate);
exports.checkoutRouter.post('/session', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { planId, billingCycle } = checkoutSchema.parse(req.body);
        // 1. Fetch Membership Plan & Pricing
        const plan = await prisma_1.prisma.membershipPlan.findUnique({
            where: { id: planId }
        });
        if (!plan || !plan.isActive) {
            return res.status(404).json({ error: 'Membership plan not found or inactive' });
        }
        // Determine the right price ID from the DB column based on billing cycle
        const priceId = billingCycle === 'monthly' ? plan.stripePriceIdMonthly :
            billingCycle === 'quarterly' ? plan.stripePriceIdQuarterly :
                plan.stripePriceIdAnnual;
        if (!priceId) {
            return res.status(400).json({ error: `Price ID not configured for ${billingCycle} billing` });
        }
        // 2. Resolve Stripe Customer
        // Check if user already has a subscription with a stripe customer ID
        const existingSub = await prisma_1.prisma.subscription.findFirst({
            where: { userId }
        });
        let customerId = existingSub?.stripeCustomerId;
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!customerId) {
            // Create new customer
            const newCustomer = await stripe_1.stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
                metadata: { userId }
            });
            customerId = newCustomer.id;
        }
        // 3. Create Checkout Session
        const session = await stripe_1.stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: customerId,
            line_items: [{
                    price: priceId,
                    quantity: 1
                }],
            success_url: `${config_1.config.FRONTEND_URL}/memberships?success=true`,
            cancel_url: `${config_1.config.FRONTEND_URL}/memberships?canceled=true`,
            metadata: {
                userId,
                planId,
                billingCycle
            }
        });
        res.json({ url: session.url });
    }
    catch (err) {
        next(err);
    }
});
exports.checkoutRouter.post('/portal', async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Find active or past_due subscription
        const sub = await prisma_1.prisma.subscription.findFirst({
            where: { userId },
            orderBy: { currentPeriodEnd: 'desc' }
        });
        if (!sub || !sub.stripeCustomerId) {
            return res.status(400).json({ error: 'No active subscription or customer found' });
        }
        const portalSession = await stripe_1.stripe.billingPortal.sessions.create({
            customer: sub.stripeCustomerId,
            return_url: `${config_1.config.FRONTEND_URL}/memberships`,
        });
        res.json({ url: portalSession.url });
    }
    catch (err) {
        next(err);
    }
});
