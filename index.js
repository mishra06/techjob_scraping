const axios = require("axios");
const fs = require("node:fs");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const itJobs = "https://www.quikr.com/jobs/it-software-developer+zwqxj1466534506";

const headers = {
    "content-type" : "text/html"
}

const itJobData =  async(url) => {
    try {
        const response = await axios.get(url, headers)
        // console.log(response.data);
        fs.writeFileSync("jobdata.txt", response.data)
    } 
    catch(err) {
        console.log("error_happened",err);
    }
} 

// itJobData(itJobs)


const readFileData = () => {
    return fs.readFileSync("jobdata.txt", {encoding: "utf-8"})
}

const callReadData = readFileData()

// console.log(callReadData);
const $ = cheerio.load(callReadData);  
const data = $(".jsListItems").find(".job-card")
// console.log(data);

let jobs = [];

data.each((index, prod)=> {
    jobs.push (
         {
        "Job-Title" : $(prod).find(".job-title").text(),
         "location" : $(prod).find(".city").text(),
         "posted-date" : $(prod).find(".jsPostedOn").text(),
         "company-name": $(prod).find(" .cursor-default").text(),
         "Job-Type": $(prod).find(".attributeVal").text()
        }
    )
})

// console.log(jobs);

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(jobs);

xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
xlsx.writeFile(workbook, "jobdetail.xlsx");



