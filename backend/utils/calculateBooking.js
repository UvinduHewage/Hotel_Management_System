function calculateBooking({ rooms, extraCharges = 0, discount = 0 }) {
    const updatedRooms = rooms.map((room) => {
      const total = room.roomRate + room.taxes + room.resortFee;
      return { ...room, total };
    });
  
    const subtotal = updatedRooms.reduce((sum, room) => sum + room.total, 0);
    const grandTotal = subtotal + extraCharges - discount;
  
    return {
      rooms: updatedRooms,
      subtotal,
      grandTotal,
    };
  }
  
  module.exports = { calculateBooking };
  