const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

module.exports.sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"JobTracker" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your email - OTP',
    html: `<p>Your OTP is: <b>${otp}</b></p><p>It expires in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports.sendJobAddedEmail = async (to, jobTitle, company) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: `New Job Added: ${jobTitle} at ${company}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2e6da4;">New Job Added to Your Tracker</h2>
        <p>Hello,</p>
        <p>You have successfully added a new job to your tracker.</p>
        <ul>
          <li><strong>Job Title:</strong> ${jobTitle}</li>
          <li><strong>Company:</strong> ${company}</li>
        </ul>
        <p>You can now keep track of application status and interview updates easily.</p>
        <p style="margin-top: 20px;">Best regards,<br/>Job Tracker Team</p>
      </div>
    `
  });
};

const generateGoogleCalendarLink = ({ jobTitle, interviewDate }) => {
  const startTime = new Date(interviewDate).toISOString().replace(/-|:|\.\d\d\d/g,"");
  const endTime = new Date(new Date(interviewDate).getTime() + 30 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g,"");

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=Interview%20for%20${encodeURIComponent(jobTitle)}&dates=${startTime}/${endTime}&details=Interview%20Scheduled%20for%20${encodeURIComponent(jobTitle)}`;
};

exports.sendInterviewUpdateEmail = async (to, { jobTitle, interviewDate, interviewType, companyName, meetingLink }) => {
  const calendarLink = generateGoogleCalendarLink({ jobTitle, interviewDate });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: `Interview Scheduled: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2e6da4;">Interview Update</h2>
        <p>Hello,</p>
        <p>Your interview for the following job has been scheduled/updated:</p>
        <ul>
          <li><strong>Job Title:</strong> ${jobTitle}</li>
          <li><strong>Company:</strong> ${companyName}</li>
          <li><strong>Type:</strong> ${interviewType}</li>
          <li><strong>Date & Time:</strong> ${new Date(interviewDate).toLocaleString()}</li>
          <li><strong>Meeting Link:</strong> <a href="${meetingLink}" target="_blank">${meetingLink}</a></li>
        </ul>
        <p>
          <a href="${calendarLink}" target="_blank" style="color: #3c763d; font-weight: bold;">📅 Add to Google Calendar</a>
        </p>
        <p>Good luck with your interview!</p>
        <p style="margin-top: 20px;">Best regards,<br/>Job Tracker Team</p>
      </div>
    `
  });
};
