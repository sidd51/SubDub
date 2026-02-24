
import User from "../models/user.model.js"

// ─── GET /api/v1/users/:id ────────────────────────────────────────────────────
// Get a user's public profile

export const getUser=async (req, res, next)=>{
    try{
      const user=await User.findById(req.params.id).select('-password');
      
        if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

//─── GET /api/v1/users/me ─────────────────────────────────────────────────────
// Get the currently logged-in user's profile (uses req.user set by auth middleware)

export const getMe =async( req, res, next)=>{
  try{
    res.status(200).json({ success: true, data: req.user});
  } catch (error) {
    next(error);
  }
}
// ─── PUT /api/v1/users/me ─────────────────────────────────────────────────────
// Update the logged-in user's name or email

export const updateMe= async(req,res,next)=>{
  try{
    const {name ,email} =req.body;

    const updated =await User.findByIdAndUpdate(
      req.user._id,
      {name, email},
      {new: true, runValidators: true}
    ).select('-password');

    res.status(200).json({ success: true, message: 'Profile updated', data: updated });
  }
  catch (error) {
    next(error);
  }
};