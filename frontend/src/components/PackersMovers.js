import React, { useState } from 'react';

const PackersMovers = () => {
  // Form ka data store karne ke liye state
  const [formData, setFormData] = useState({
    from_location: '',
    to_location: '',
    move_date: '',
    inventory_items: ''
  });

  const [message, setMessage] = useState('');

  // Jab user kuch type karega, to state update hogi
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Jab user form submit karega
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Sending request...');

    try {
      const response = await fetch('https://urbanshift-project.onrender.com/api/relocation/requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('✅ Request Sent Successfully! We will contact you soon.');
        setFormData({ from_location: '', to_location: '', move_date: '', inventory_items: '' }); // Form clear karein
      } else {
        setMessage('❌ Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error connecting to server.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🚚 Packers & Movers Service</h2>
      <p>Fill this form to get a shifting estimate.</p>

      {message && <p style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Kahan se shift karna hai */}
        <div>
          <label><strong>From Location:</strong></label>
          <input
            type="text"
            name="from_location"
            value={formData.from_location}
            onChange={handleChange}
            placeholder="Ex: Malviya Nagar, Jaipur"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Kahan jana hai */}
        <div>
          <label><strong>To Location:</strong></label>
          <input
            type="text"
            name="to_location"
            value={formData.to_location}
            onChange={handleChange}
            placeholder="Ex: Vaishali Nagar, Jaipur"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Kab shift karna hai */}
        <div>
          <label><strong>Moving Date:</strong></label>
          <input
            type="date"
            name="move_date"
            value={formData.move_date}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Kya saman hai */}
        <div>
          <label><strong>Items List (Inventory):</strong></label>
          <textarea
            name="inventory_items"
            value={formData.inventory_items}
            onChange={handleChange}
            placeholder="Ex: 1 Bed, 1 Sofa, 2 Almirah, 5 Cartons..."
            required
            rows="4"
style={{ width: '100%', padding: '8px', marginTop: '5px' }}
></textarea>
</div>
        <button 
          type="submit" 
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '10px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Get Free Quote 🚀
        </button>

      </form>
    </div>
  );
};

export default PackersMovers;