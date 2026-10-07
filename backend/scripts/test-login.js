const adminEmail = 'admin@thegrandfitness.com';
const newEmail = 'ankuraniladarsh@gmail.com';
const password = process.env.ADMIN_PASSWORD || 'GrandFitnessAdmin2024!'; // Based on typical seed defaults

async function testLogin(email, pwd) {
  try {
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pwd })
    });
    const data = await res.json();
    return { status: res.status, ok: res.ok, role: data.user?.role };
  } catch(e) {
    return { error: e.message };
  }
}

async function main() {
  console.log(`Testing old email (${adminEmail})...`);
  const oldRes = await testLogin(adminEmail, password);
  console.log(`Old Email Login -> Status: ${oldRes.status}, OK: ${oldRes.ok}`);

  console.log(`Testing new email (${newEmail})...`);
  const newRes = await testLogin(newEmail, password);
  console.log(`New Email Login -> Status: ${newRes.status}, OK: ${newRes.ok}, Role: ${newRes.role}`);
}
main();
