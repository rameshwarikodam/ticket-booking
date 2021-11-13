module.exports = (sequelize, Sequelize) => {
    const Userdetail = sequelize.define("userdetails", {
      picture: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.DATE,
      },
      address: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      }
    });
    return Userdetail;
  };