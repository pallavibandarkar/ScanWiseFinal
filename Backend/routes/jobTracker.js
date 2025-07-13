const express = require('express');
const router = express.Router();
const JobTracker = require('../models/jobtrack.js');
const isLoggedIn  = require('../middleware.js')
const { sendJobAddedEmail, sendInterviewUpdateEmail} = require('../utils/sendOtp.js')
const User = require('../models/user.js')
// Add to tracker
router.post('/add', isLoggedIn,async (req, res) => {
  try {
    console.log("User",req.user)
    const id = req.user.userId;
    const tracker = new JobTracker({
        user:id,
        ...(req.body.scan && { scan: req.body.scan }),
        jobTitle:req.body.jobTitle,
        companyName:req.body.companyName,
        jobDescription:req.body.jobDescription,
        applicationDate:req.body.applicationDate,
        salary : req.body.salary,
        status:req.body.status,
        interview:{
            type:req.body.interviewType,
            date:req.body.interviewDate,
            email:req.body.contactEmail,
            meetingLink:req.body.meetingLink,
        }
    })
    const result = await tracker.save();

    const user = await User.findById(id);
    if (user?.email) {
      await sendJobAddedEmail(user.email, req.body.jobTitle, req.body.companyName);
    }
    res.status(201).json({ message: 'Job added to tracker', result });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to add job to tracker', details: err.message });
  }
});


router.get('/user', isLoggedIn,async (req, res) => {
  try {
    console.log(req.user)
    const jobs = await JobTracker.find({ user: req.user.userId });
    console.log(jobs)
    res.status(200).json({ data: jobs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job tracker entries' });
  }
});

router.get("/job/:id",isLoggedIn,async(req,res)=>{
  try{
    const result = await JobTracker.findById(req.params.id);
    if(!result){
      return res.status(500).json({msg:"Track Job Details Not found!!"})
    }
    res.status(200).json({msg:"Job Details found",data:result});
  }catch(err){
    res.status(500).json({data:err.message, msg:"Track Job Details Not found!!"})
  }
})


router.put('/update/:id',isLoggedIn, async (req, res) => {
  try {
    const updated = await JobTracker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const interviewType = updated.interview.type;
    const interviewDate = updated.interview.date;
    const meetingLink = updated.interview.meetingLink;
    const contactEmail = updated.interview.email;

    const { jobTitle,companyName } = req.body;

    if (interviewType || interviewDate || contactEmail || meetingLink) {
      const user = await User.findById(req.user.userId);

      if (user?.email) {
        await sendInterviewUpdateEmail(user.email, {
          jobTitle: updated.jobTitle,
          companyName: updated.companyName,
          interviewType: interviewType || updated.interview.type,
          interviewDate: interviewDate || updated.interview.date,
          meetingLink: meetingLink || updated.interview.meetingLink,
        });
      }
    }
    res.status(200).json({ message: 'Updated successfully', data:updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job tracker entry' });
  }
});

// Delete a tracked job
router.delete('/delete/:id', async (req, res) => {
  try {
    await JobTracker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job tracker entry' });
  }
});

module.exports = router;
