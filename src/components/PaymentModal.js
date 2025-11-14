import React, { useState } from 'react';

const PaymentModal = ({ user, friendUser, onClose }) => {
  // Safe null checks
  const userPayload = user || { totalPenalty: 0, upiId: '' };
  const friendPayload = friendUser || { name: 'Friend', upiId: 'friend@upi' };
  
  const [paymentAmount, setPaymentAmount] = useState(userPayload.totalPenalty || 0);
  const [upiId, setUpiId] = useState(friendPayload.upiId || '');
  const [showQR, setShowQR] = useState(false);

  const generateUPIString = () => {
    if (!upiId || !paymentAmount) {
      alert('Please enter valid UPI ID and amount');
      return null;
    }
    
    const name = encodeURIComponent(friendPayload.name || 'Friend');
    const desc = encodeURIComponent('Habit Accountability Payment');
    return `upi://pay?pa=${upiId}&pn=${name}&am=${paymentAmount}&tn=${desc}`;
  };

  const handleGenerateQR = () => {
    if (generateUPIString()) {
      setShowQR(true);
    }
  };

  const getQRUrl = () => {
    const upiString = generateUPIString();
    if (!upiString) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>💳 Payment</h2>
        
        {!showQR ? (
          <>
            <div style={{marginBottom: '20px'}}>
              <div style={{fontSize: '13px', color: '#666', marginBottom: '8px'}}>
                Total Penalties Owed to {friendPayload.name || 'Friend'}
              </div>
              <div style={{fontSize: '28px', fontWeight: '700', color: '#ef4444'}}>
                ₹{(userPayload.totalPenalty || 0).toLocaleString()}
              </div>
            </div>

            <div className="form-group">
              <label>Friend's UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="friend@upi"
              />
            </div>

            <div className="form-group">
              <label>Amount to Pay (₹)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                min="0"
                step="50"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                Leave blank to use total penalty amount
              </small>
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleGenerateQR}>
                Generate Payment QR
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <div style={{fontSize: '14px', color: '#666', marginBottom: '12px'}}>
                Pay ₹{paymentAmount.toLocaleString()} to {friendPayload.name || 'Friend'}
              </div>
              
              <div style={{
                background: '#f9f9f9',
                padding: '16px',
                borderRadius: '8px',
                display: 'inline-block',
                marginBottom: '16px'
              }}>
                <img 
                  src={getQRUrl()} 
                  alt="Payment QR Code"
                  style={{width: '250px', height: '250px'}}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
                <div style={{display: 'none', padding: '20px'}}>
                  <p style={{fontSize: '12px', color: '#666'}}>
                    QR Code: Scan with any UPI app (Google Pay, PhonePe, Paytm)
                  </p>
                  <p style={{fontSize: '11px', color: '#999', marginTop: '8px'}}>
                    UPI: {upiId}<br/>
                    Amount: ₹{paymentAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffecb5',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#856404',
                marginBottom: '16px'
              }}>
                <strong>Instructions:</strong> Scan this QR with any UPI app to pay instantly.
              </div>
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowQR(false)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => {
                alert('Payment completed! Your penalty balance has been updated.');
                onClose();
              }}>
                Payment Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
