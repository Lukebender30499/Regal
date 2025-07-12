import axios from 'axios';

axios.post('http://localhost:3000/inbound-call', {
  call_inbound: {
    from_number: '+12025550123',
    to_number:   '+14155550123',
    agent_id:    'agent_42'
  }
})
.then(res => console.log('✅  Server response:', res.data))
.catch(err => console.error('❌  Error:', err.response?.data || err.message));