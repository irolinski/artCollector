artCollector is a webapp meant for cataloguing art. As of now, it is still in its early stage and the plan is that it will be further developed.

Features include:

* Fully-fledged art catalogue app - suitable for both desktop and mobile use
* Data table w/ rich customization options and a search function
* Elegant minimalistic show page design w/ custom made carousels that automatically adapt to various images sizes
* Two types of leaflets (png files meant for printing) that can be automatically generated for each piece
* Raw collection data can be exported to an xlsx file on one click of a button
* Each user can choose to make their collection either public, private or only visible upon entering a passcode
* Forgot Password service using auto-generated token sent on user's email

It was built in javascript w/ jquery using nodeJs w/ express and various labraries needed for particular backend tasks. It uses bootstrap for the front end. 
MongoDB was used as a database. 

The technologies used include :
- joi
- jquery datatables
- jsonwebtoken
- moment
- mongoose
- mongo-xlsx
- multer
- nodemailer
- passport
- xlsx
