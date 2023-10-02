const express = require('express');
const app=express();
const PORT=6969;

const blogRoute=require('./routes/blog')
const blogSearchRoute=require('./routes/blogsearch')
app.use('/api/blog-stats',blogRoute)
app.use('/api/blog-search',blogSearchRoute)

app.listen(PORT,()=>{
    console.log("Server running")
})