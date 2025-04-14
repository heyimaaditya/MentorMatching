const profileModel = require('../models/profileModel');

async function createProfile(req, res) {
  try {
    const { role, skills, interests, bio } = req.body;
    // Retrieve authenticated user from middleware.
    const user_id = req.user.id;

    if (!role || (role !== 'mentor' && role !== 'mentee')) {
      return res.status(400).json({ message: 'Role must be either mentor or mentee.' });
    }

    // Prevent creating duplicate profiles.
    const existingProfile = await profileModel.getProfileByUserId(user_id);
    if (existingProfile) {
      return res.status(409).json({ message: 'Profile already exists for this user.' });
    }
    
    const profile = await profileModel.createProfile(user_id, role, skills || '', interests || '', bio || '');
    return res.status(201).json({ message: 'Profile created successfully.', profile });
  } catch (error) {
    console.error('Create profile error:', error);
    return res.status(500).json({ message: 'Server error while creating profile.' });
  }
}

async function updateProfile(req, res) {
  try {
    const { role, skills, interests, bio } = req.body;
    const user_id = req.user.id;
    
    // Check if profile exists.
    let existingProfile = await profileModel.getProfileByUserId(user_id);
    if (!existingProfile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    // Validate role if provided.
    if (role && role !== 'mentor' && role !== 'mentee') {
      return res.status(400).json({ message: 'Role must be either mentor or mentee.' });
    }

    // Retain existing fields if not provided.
    const updatedProfile = await profileModel.updateProfile(
      existingProfile.id,
      role || existingProfile.role,
      skills !== undefined ? skills : existingProfile.skills,
      interests !== undefined ? interests : existingProfile.interests,
      bio !== undefined ? bio : existingProfile.bio
    );
    return res.status(200).json({ message: 'Profile updated successfully.', profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error while updating profile.' });
  }
}

async function getAllProfiles(req, res) {
  try {
    const filters = {
      role: req.query.role,
      skills: req.query.skills,
      interests: req.query.interests,
    };
    
    const profiles = await profileModel.getAllProfiles(filters);
    return res.status(200).json({ profiles });
  } catch (error) {
    console.error('Get profiles error:', error);
    return res.status(500).json({ message: 'Server error while retrieving profiles.' });
  }
}

async function getMyProfile(req, res) {
    try {
      const user_id = req.user.id;
      const profile = await profileModel.getProfileByUserId(user_id);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }
      return res.status(200).json({ profile });
    } catch (error) {
      console.error('Get my profile error:', error);
      return res.status(500).json({ message: 'Server error while retrieving your profile.' });
    }
  }
  async function deleteProfile(req, res) {
    try {
      const user_id = req.user.id;
  
      // Check if profile exists.
      const existingProfile = await profileModel.getProfileByUserId(user_id);
      if (!existingProfile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }
  
      await profileModel.deleteProfile(existingProfile.id);
      return res.status(200).json({ message: 'Profile deleted successfully.' });
    } catch (error) {
      console.error('Delete profile error:', error);
      return res.status(500).json({ message: 'Server error while deleting profile.' });
    }
  }
  module.exports = {
    createProfile,
    updateProfile,
    getAllProfiles,
    getMyProfile,
    deleteProfile,
  };
  
