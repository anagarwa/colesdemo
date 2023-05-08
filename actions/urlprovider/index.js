/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */
const fetch = require('node-fetch')


const parseDateString = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
}

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  const excels = [
    'https://main--screens-ad-management--mchandak29.hlx.live/content/Suppliers/reebok/reebok-schedule.json',
    'https://main--screens-ad-management--mchandak29.hlx.live/content/Suppliers/pepsi/pepsi-schedule.json',
    'https://main--screens-ad-management--mchandak29.hlx.live/content/Suppliers/nike/nike-schedule.json',
    'https://main--screens-ad-management--mchandak29.hlx.live/content/Suppliers/nestle/nestle-schedule.json',
    'https://main--screens-ad-management--mchandak29.hlx.live/content/Suppliers/dr-pepper/dr-pepper-schedule.json',
    'https://main--screens-ad-management--mchandak29.hlx.live/content/Suppliers/coles/coles-schedule.json',
    'https://main--screens-ad-management--mchandak29.hlx.live/content/Suppliers/coca-cola/coca-cola-schedule.json'
  ];
  const assets = [];
  let emergencyFlag = false;
  for (let i = 0; i < excels.length; i++) {
    try {
      const response = await fetch(excels[i]);
      if (!response || !response.ok) {
        console.warn(`Fetching excel data failed from ${excels[i]}`);
        continue;
      }
      const data = (await response.json()).data;
      data.forEach((asset) => {
        const assetDetails = {
          link: asset['Published Link'],
          startTime: asset.Start,
          endTime: asset.End,
          duration: asset.duration || 8
        }
        if (asset.EMERGENCY && 'yes' === asset.EMERGENCY.toLowerCase()) {
          emergencyFlag = true;
          assetDetails.emergency = true;
        }
        assets.push(assetDetails);
      });
    } catch (err) {
      console.error(`Exception while processing excel ${excels[i]}`, err);
    }
  }
  const results = {
    data: []
  }
  if (emergencyFlag) {
    results.data = assets.filter((asset) => asset.emergency).map((asset) => {
      return {
        'Published Link': asset.link,
        'Duration': asset.duration
      }
    });
  } else {
    assets.forEach((asset) => {
      const now = new Date();
      if (parseDateString(asset.startTime) <= now && parseDateString(asset.endTime) >= now) {
        results.data.push({
          'Published Link': asset.link,
          'Duration': asset.duration
        })
      }
    });
  }
  return {
    statusCode: 200,
    body: results
  };
}

exports.main = main