let sql = {
  user: {
    add: 'insert into position(username, password, address, email) values (?,?,?,?)',
    sel: 'select * from position'
  },
  address: {
    sel: 'select * from address',
    add: 'insert into address(name, address, tag, username,sex,phone,house) values (?,?,?,?,?,?,?)'
  }
};

module.exports = sql;
