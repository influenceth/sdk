const INSTANT_TRANSPORT_DISTANCE = 5; // instant transport distance in km

const STATUSES = {
  PACKAGED: 3, // packaged, controlled by origin
  ON_HOLD: 1, // controlled by a system (rather than a user)
  SENT: 4, // sent, controlled by destination
  COMPLETE: 2 // complete at destination
};

export default {
  INSTANT_TRANSPORT_DISTANCE,
  STATUSES
};
