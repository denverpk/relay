export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { receiver, amount } = req.body;
    const GELATO_API_KEY = 'a2rSDWmO93Uw5hKuENl4cFb9HmmFOADHvZzYIQT43D4_'; // Replace with your API Key
    const GELATO_URL = 'https://relay.gelato.digital/tasks'; // Gelato Relay Task API Endpoint

    const task = {
      chainId: 8453, // Base Mainnet Chain ID
      target: receiver,
      data: '0x',
      value: (parseFloat(amount) * 1e18).toString(),
      isSponsored: true // Gelato Paymaster Sponsored
    };

    const response = await fetch(GELATO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GELATO_API_KEY}`
      },
      body: JSON.stringify(task)
    });

    const data = await response.json();
    if (response.ok && data.taskId) {
      return res.status(200).json({ taskId: data.taskId });
    } else {
      console.error('Gelato Relayer Error:', data);
      return res.status(500).json({ message: data.message || 'Relayer failed' });
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
