module.exports = (sequelize, type) => {
    return sequelize.define('Users', {
        id: {
            field: 'USE_ID',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account: type.STRING,
        password: type.STRING,
        fullName: type.STRING
    }, { timestamps: false })
}