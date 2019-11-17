const Sequelize = require('sequelize');
const UserModel = require('./user')
const CustomerTypeModel = require('./customer_type')
const CustomerModel = require('./customer')

const sequelize = new Sequelize('test', 'sa', '123', {
    dialect: 'mssql',
    host: 'localhost',
    dialectOptions: {
        options: {
            instanceName: 'SQLEXPRESS',
            encrypt: true
        }
    },
    pool: { max: 20, min: 0, acquire: 30000, idle: 10000 },
    logging: true
});

const User = UserModel(sequelize, Sequelize)
const CustomerType = CustomerTypeModel(sequelize, Sequelize)
const Customer = CustomerModel(sequelize, Sequelize)

Customer.belongsTo(CustomerType, { foreignKey: 'CUT_ID', as: 'customerType' });
CustomerType.hasMany(Customer, { foreignKey: 'CUT_ID', as: 'customers' });

//run once, then comment-out
// sequelize.sync({ force: true }).then(() => {
//     console.log('Database & tables created!')
// });

module.exports = {
    User,
    CustomerType,
    Customer
}