const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Trip', {
    trip_number: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.STRING,
    origin_lat: DataTypes.FLOAT,
    origin_lng: DataTypes.FLOAT,
    origin_name: DataTypes.STRING,
    dest_lat: DataTypes.FLOAT,
    dest_lng: DataTypes.FLOAT,
    dest_name: DataTypes.STRING,
    mode: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    duration_sec: DataTypes.INTEGER,
    group_size: DataTypes.INTEGER
  });
};
