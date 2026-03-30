async function main() {
  const res = await fetch('http://127.0.0.1:3000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientType: 'new',
      bookingFor: 'Myself',
      patientInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        birthDate: '1990-01-01',
        zipCode: '12345',
        comments: 'test'
      },
      dentistName: 'Dr. Dan Adler',
      date: '2026-03-15',
      time: '09:00 AM',
      treatment: 'Consultation',
      notes: 'test'
    })
  });
  
  const text = await res.text();
  console.log('STATUS:', res.status);
  console.log('BODY:', text);
}

main().catch(console.error);
