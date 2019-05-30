module.exports = {
  dragonTreasure: async (req, res) => {
    const treasure = await req.app.get("db").get_dragon_treasure(1);
    return res.status(200).send(treasure);
  },

  getUserTreasure: async (req, res) => {
    const userTreasure = await req.app
      .get("db")
      .get_user_treasure([req.session.user.id]);
    return res.status(200).send(userTreasure);
  },

  addMyTreasure: async (req, res) => {
    // destructure treasure url from req.body
    const { treasureURL } = req.body;
    // get id from the req.session.user
    const { id } = req.session.user;
    const userTreasure = await req.app
      // get the database connection
      .get("db")
      // invoke the sql file add_user_treasure with the two arguements
      .add_user_treasure([treasureURL, id]);
    // send the results of this query
    console.log(treasureURL);
    return res.status(200).send(userTreasure);
  },

  getAllTreasure: async (req, res) => {
    const allTreasure = await req.app.get("db").get_all_treasure();
    return res.status(200).send(allTreasure);
  }
};
