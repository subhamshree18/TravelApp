// backend/controllers/trips.js
const pool = require("../db");
const { v4: uuidv4 } = require('uuid');

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const {
      userId,
      origin_name,
      dest_name,
      mode,
      start_time,
      end_time,
      group_size
    } = req.body;

   const trip_id=uuidv4();


    // 2. Auto-fetch origin_lat & origin_lng from origin_name
    let parsed_origin_lat = "";
    let parsed_origin_lng ="";

    if (origin_name && origin_name.includes(',')) {
      const parts = origin_name.split(',').map(part => part.trim());
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        parsed_origin_lat = parseFloat(parts[0]);
        parsed_origin_lng = parseFloat(parts[1]);
      }
    }

    
    

    let parsed_dest_lat = "";
    let parsed_dest_lng ="";
    if (dest_name && dest_name.includes(',')) {
      const parts = dest_name.split(',').map(part => part.trim());
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        parsed_dest_lat = parseFloat(parts[0]);
        parsed_dest_lng = parseFloat(parts[1]);
      }
    }

    // 3. Auto-calculate duration from start_time and end_time
    // Also, convert string dates to Date objects for DB insertion.
    let calculated_duration_sec = 0;
    const startDate = start_time ? new Date(start_time) : null;
    const endDate = end_time ? new Date(end_time) : null;
    const final_start_time = (startDate && !isNaN(startDate)) ? startDate : null;
    const final_end_time = (endDate && !isNaN(endDate)) ? endDate : null;

    if (final_start_time && final_end_time && final_end_time > final_start_time) {
      calculated_duration_sec = Math.round((final_end_time - final_start_time) / 1000);
    }
    
    
    const [result] = await pool.query(
      `INSERT INTO trips 
      (user_id, trip_number, origin_lat, origin_lng, origin_name, dest_lat, dest_lng, dest_name, mode, start_time, end_time, duration_sec, group_size, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        trip_id,
        parsed_origin_lat,
        parsed_origin_lng,
        origin_name,
        parsed_dest_lat,
        parsed_dest_lng,
        dest_name,
        mode,
        final_start_time,
        final_end_time,
        calculated_duration_sec,
        group_size,
        new Date(),
        new Date()
      ]
    );

    res.json({ success: true, tripId: trip_id });
  } //catch (err) {
  //   console.error(err);
  //   res.status(500).json({ success: false, error: "Database insert failed" });
  // }
  catch (err) {
  console.error("Error inserting trip:", err.message);
  console.error(err); // full stack trace
  res.status(500).json({ success: false, error: err.message });
}

};

//Get all trip by UserId  
const getTrips = async (req, res) => {
  try { 
    const { userId } = req.query;
    const [result] = await pool.query(
      `SELECT * FROM trips WHERE user_id = ? order by createdAt desc`,
      [userId]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { createTrip, getTrips };  



