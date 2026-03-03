import About from '../models/About.js';

// Get about page content
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    // If no about data exists, create default
    if (!about) {
      about = new About();
      about.save();
    }
    
    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update about page content (Admin only)
export const updateAbout = async (req, res) => {
  try {
    const {
      companyName,
      tagline,
      description,
      missionStatement,
      visionStatement,
      yearEstablished,
      foundedBy,
      totalCars,
      totalCustomers,
      totalTrips,
      features,
      team,
      contactEmail,
      contactPhone,
      address,
      socialLinks
    } = req.body;

    let about = await About.findOne();
    
    if (!about) {
      about = new About();
    }

    about.companyName = companyName || about.companyName;
    about.tagline = tagline || about.tagline;
    about.description = description || about.description;
    about.missionStatement = missionStatement || about.missionStatement;
    about.visionStatement = visionStatement || about.visionStatement;
    about.yearEstablished = yearEstablished || about.yearEstablished;
    about.foundedBy = foundedBy || about.foundedBy;
    about.totalCars = totalCars !== undefined ? totalCars : about.totalCars;
    about.totalCustomers = totalCustomers !== undefined ? totalCustomers : about.totalCustomers;
    about.totalTrips = totalTrips !== undefined ? totalTrips : about.totalTrips;
    about.features = features || about.features;
    about.team = team || about.team;
    about.contactEmail = contactEmail || about.contactEmail;
    about.contactPhone = contactPhone || about.contactPhone;
    about.address = address || about.address;
    about.socialLinks = socialLinks || about.socialLinks;
    about.updatedAt = Date.now();

    await about.save();

    res.status(200).json({
      success: true,
      message: 'About page updated successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add team member
export const addTeamMember = async (req, res) => {
  try {
    const { name, position, image, bio } = req.body;

    let about = await About.findOne();
    
    if (!about) {
      about = new About();
    }

    about.team.push({
      name,
      position,
      image,
      bio
    });

    await about.save();

    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove team member
export const removeTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About page not found'
      });
    }

    about.team = about.team.filter(member => member._id.toString() !== memberId);

    await about.save();

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add feature
export const addFeature = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    let about = await About.findOne();
    
    if (!about) {
      about = new About();
    }

    about.features.push({
      title,
      description,
      icon
    });

    await about.save();

    res.status(201).json({
      success: true,
      message: 'Feature added successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};