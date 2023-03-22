const { Builder, By, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;


async function scrapeProfile(url) {
  const options = new chrome.Options();
  options.addArguments('--disable-extensions');
  options.addArguments('--disable-popup-blocking');
  options.addArguments('--profile-directory=Default');
  options.addArguments('--disable-plugins-discovery');
  options.addArguments('--incognito');
  options.addArguments("--headless");
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  // Login to LinkedIn
  await driver.get('https://www.linkedin.com/login');
  await driver.manage().setTimeouts({ implicit: 5000 });
  const emailInput = await driver.findElement(By.id('username'));
  const passwordInput = await driver.findElement(By.id('password'));
  await emailInput.sendKeys('');// Add your LinkedIn email Address
  await passwordInput.sendKeys('', Key.RETURN);// Add your LinkedIn Password

  await driver.get(url);

  await driver.manage().setTimeouts({ implicit: 5000 });
  const profileSection = await driver.findElement(By.css(".pv-top-card"));
  const name = await profileSection.findElement(By.css(".pv-text-details__left-panel h1")).getText();


  const title = await profileSection.findElement(By.css(".ph5 .relative .pv-text-details__left-panel .text-body-medium")).getText();


  const location = await profileSection.findElement(By.css(".ph5 .relative .mt2 span")).getText();

  
      let about = "*missing value*";
      try {
         about = await driver.findElement(By.css("section:has(#about) .pv-shared-text-with-see-more span").getText()); // Is outside "profileSection"
      }catch (e) {
         about = "*missing value*";
      }

  const experiences = [];
  const jobs = await driver.findElements(By.css('section:has(#experience)>div>ul>li'));
  for (const job of jobs) {
    const exp = {};
    exp.Position = await job.findElement(By.css('span[class="mr1 t-bold"] span')).getText();
    exp.Company = await job.findElement(By.css('span[class="t-14 t-normal"] span')).getText();
    const dateRange = await job.findElement(By.css('span[class="t-14 t-normal t-black--light"] span')).getText();
    exp['Date Range'] = dateRange.replace('Dates Employed', '').trim();
    try {
      exp.Location = await job.findElement(By.css('span[class="t-14 t-normal t-black--light"]:nth-child(4) span')).getText();
    } catch (e) {
      exp.Location = '*missing value*';
    }
    try {
      exp.Description = await job.findElement(By.css('ul li ul span[aria-hidden=true]')).getText();
    } catch (e) {
      exp.Description = '*missing value*';
    }
    experiences.push(exp);
  }

  
    // Education
    let education = []
    let education_list = await driver.findElements(By.css('section:has(#education)>div>ul>li'))
    for (let edu of education_list) {
    let edu_dict = {}
    edu_dict['School'] = await edu.findElement(By.css('span[class="mr1 hoverable-link-text t-bold"] span')).getText()
    try {
    edu_dict['Degree'] = await edu.findElement(By.css('span[class="t-14 t-normal"] span')).getText()
    } catch(e){
        edu_dict['Degree'] = 'missing value'
    }
    try{
    let date_range = await edu.findElement(By.css('span[class="t-14 t-normal t-black--light"] span')).getText()
    edu_dict['Date Range'] = date_range.replace('Dates attended or expected graduation', '').trim()
    }catch(e){
        edu_dict['Date Range'] = 'missing value'
    }
    try {
    edu_dict['Description'] = await edu.findElement(By.css('ul li ul span[aria-hidden=true]')).getText()
    } catch (e) {
    edu_dict['Description'] = 'missing value'
    }
    education.push(edu_dict)
    }
    
    let recommendations = []
    try{
    let recommendations_list = await driver.findElements(By.css('section:has(#recommendations)>div>div>div>ul>li'))
    if (recommendations_list.length > 0) {
    for (let rec of recommendations_list) {
        let rec_dict = {}
        rec_dict['Recommender'] = await rec.findElement(By.css('span[class="mr1 hoverable-link-text t-bold"] span')).getText()
        rec_dict['Company'] = await rec.findElement(By.css('span[class="t-14 t-normal"] span')).getText()
        let date_range = await rec.findElement(By.css('span[class="t-14 t-normal t-black--light"] span')).getText()
        rec_dict['Date and Relation'] = date_range.replace('Date written and Relation', '').trim()
        try {
        rec_dict['Description'] = await rec.findElement(By.css('ul li ul span[aria-hidden=true]')).getText()
        } catch (e) {
        rec_dict['Description'] = '*missing value*'
        }
        recommendations.push(rec_dict)
    }
    }
    }catch(e){
        recommendations = [Null]

    }


    // Clean up
    await driver.quit()

    const outputArray = [
        { Name: name },
        { Title: title },
        { Location: location },
        { About: about },
        { Experiences: '' },
        ...experiences.map((exp) => ({
          Position: exp.Position,
          Company: exp.Company,
          'Job Date Range': exp['Date Range'],
          JobLocation: exp.Location,
          JobDescription: exp.Description,
        })),
        { Education: '' },
        ...education.map((edu) => ({
          School: edu.School,
          Degree: edu.Degree,
          'School Date Range': edu['Date Range'],
          SchoolDescription: edu.Description,
        })),
        { Recommendations: '' },
        ...recommendations.map((rec) => ({
           Recommender: rec.Recommender,
           RecCompany: rec.Company,
          'Date and Relation': rec['Date and Relation'],
          Description: rec.Description,
        })),
      ];
    
      // Write the output to a CSV file
      const csvWriter = createCsvWriter({
        path: 'output.csv',
        header: [
          { id: 'Name', title: 'Name' },
          { id: 'Title', title: 'Title' },
          { id: 'Location', title: 'Location' },
          { id: 'About', title: 'About' },
          { id: 'Experiences', title: 'Experiences' },
          { id: 'Position', title: 'Position' },
          { id: 'Company', title: 'Company' },
          { id: 'Job Date Range', title: 'Date Range' },
          { id: 'Job Location', title: 'Location' },
          { id: 'Job Description', title: 'Description' },
          { id: 'Education', title: 'Education' },
          { id: 'School', title: 'School' },
          { id: 'Degree', title: 'Degree' },
          { id: 'School Date Range', title: 'Date Range' },
          { id: 'School Description', title: 'Description' },
          { id: 'Recommender', title: 'Recommender' },
          { id: 'Company', title: 'RecCompany' },
          { id: 'Date and Relation', title: 'Date and Relation' },
          { id: 'Description', title: 'Description' },
        ],
      });
      await csvWriter.writeRecords(outputArray);
    
      // Return the output as a string
      //return outputArray.map((obj) => Object.values(obj).join(': ')).join('\n');
      return {
        Name: name,
        Title: title,
        Location: location,
        About: about,
        Experiences: experiences,
        Education: education,
        Recommendations: recommendations,
      };
      
}
module.exports = scrapeProfile;