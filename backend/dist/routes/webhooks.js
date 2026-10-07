"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhooksRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const stripe_1 = require("../lib/stripe");
const config_1 = require("../config");
exports.webhooksRouter = (0, express_1.Router)();
exports.webhooksRouter.post('/stripe', async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        // Note: This relies on the raw body being attached to req.body in app.ts
        // using express.raw({ type: 'application/json' }) before mounting this router.
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, config_1.config.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error(`⚠️ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Idempotency Check
    const existingEvent = await prisma_1.prisma.paymentEvent.findUnique({
        where: { stripeEventId: event.id }
    });
    if (existingEvent) {
        return res.status(200).json({ received: true, skipped: true, reason: 'Duplicate event' });
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                if (session.mode === 'subscription' && session.subscription) {
                    const userId = session.metadata?.userId;
                    const planId = session.metadata?.planId;
                    const billingCycle = session.metadata?.billingCycle;
                    if (!userId || !planId || !billingCycle) {
                        console.error('Missing metadata on checkout session', session.id);
                        break;
                    }
                    const stripeSubscription = await stripe_1.stripe.subscriptions.retrieve(session.subscription);
                    await prisma_1.prisma.subscription.upsert({
                        where: { stripeSubscriptionId: stripeSubscription.id },
                        update: {
                            status: stripeSubscription.status.toUpperCase(),
                            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
                        },
                        create: {
                            userId,
                            planId,
                            billingCycle,
                            stripeSubscriptionId: stripeSubscription.id,
                            stripeCustomerId: session.customer,
                            status: stripeSubscription.status.toUpperCase(),
                            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
                        }
                    });
                }
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                await prisma_1.prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        status: subscription.status.toUpperCase(),
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                    }
                });
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await prisma_1.prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: { status: 'CANCELED' }
                });
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    await prisma_1.prisma.subscription.updateMany({
                        where: { stripeSubscriptionId: invoice.subscription },
                        data: { status: 'PAST_DUE' }
                    });
                }
                break;
            }
        }
        // Mark event as processed
        await prisma_1.prisma.paymentEvent.create({
            data: {
                stripeEventId: event.id,
                type: event.type,
                payload: JSON.stringify(event.data.object)
            }
        });
        res.status(200).json({ received: true });
    }
    catch (err) {
        next(err);
    }
});
