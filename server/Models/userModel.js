module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validates the email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM('active', 'blocked'),
      defaultValue: 'active'
    },
  
    recoveryToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recoveryTokenExp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  });


  return User;
};