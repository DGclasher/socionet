import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    let responseData = { ...user.toObject() };
    delete responseData.password;
    res.status(200).json({ user: responseData });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id != friendId);
      friend.friends = friend.friends.filter((id) => id != id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await User.findByIdAndUpdate(id, { friends: user.friends });
    const updatedFriend = await User.findByIdAndUpdate(
      friendId,
      { friends: friend.friends },
      { new: true }
    );
    // await user.save();
    // await friend.save();
    const formattedFriends = updatedFriend.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json({ message: "Friend removed", info: formattedFriends });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
