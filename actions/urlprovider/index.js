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
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')
var LinkedList = require("dbly-linked-list");


// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = []
    const requiredHeaders = [/*add require headers*/]
    var name = params.name || 'stranger';
    var place = params.place || 'unknown';
    var storeid = params.storeid ||"Coles_Aus_123";
    var numofslot = params.numofslot || 18;
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    logger.info('Got the error1')
    if (errorMessage) {
      // return and log client errors
      logger.info('Got the error2')
      return errorResponse(400, errorMessage, logger)
    }

    // extract the user Bearer token from the Authorization header
    //const token = getBearerToken(params)

    // replace this with the api you want to access
    const apiEndpoint = 'https://adobeioruntime.net/api/v1'


    const data = await fetch("https://main--screens-ad-management--mchandak29.hlx.live/seller-slots.json");
    const sellerData = await data.json();

    var slot1 = []
    var slot2 = []
    var slot3 = []
    var slot4 = []
    var slot5 = []
    var slot6 = []

    for (var i = 0;i<sellerData["data"].length;i++) {
      if (sellerData["data"][i]["Slot 1"]==="Yes") {
        if (slot1.length === 0) {
          slot1[0] = sellerData["data"][i]["Seller Schedule"];
        } else {
          slot1[slot1.length] = sellerData["data"][i]["Seller Schedule"];
        }

      }
      if (sellerData["data"][i]["Slot 2"]==="Yes") {
        if (slot2.length === 0) {
          slot2[0] = sellerData["data"][i]["Seller Schedule"];
        } else {
          slot2[slot2.length] = sellerData["data"][i]["Seller Schedule"];
        }

      }
      if (sellerData["data"][i]["Slot 3"]==="Yes") {
        if (slot3.length === 0) {
          slot3[0] = sellerData["data"][i]["Seller Schedule"];
        } else {
          slot3[slot3.length] = sellerData["data"][i]["Seller Schedule"];
        }

      }

      if (sellerData["data"][i]["Slot 4"]==="Yes") {
        if (slot4.length === 0) {
          slot4[0] = sellerData["data"][i]["Seller Schedule"];
        } else {
          slot4[slot4.length] = sellerData["data"][i]["Seller Schedule"];
        }

      }

      if (sellerData["data"][i]["Slot 5"]==="Yes") {
        if (slot5.length === 0) {
          slot5[0] = sellerData["data"][i]["Seller Schedule"];
        } else {
          slot5[slot5.length] = sellerData["data"][i]["Seller Schedule"];
        }
      }

      if (sellerData["data"][i]["Slot 6"]==="Yes") {
        if (slot6.length === 0) {
          slot6[0] = sellerData["data"][i]["Seller Schedule"];
        } else {
          slot6[slot6.length] = sellerData["data"][i]["Seller Schedule"];
        }

      }


    }
    var slots = [slot1, slot2, slot3, slot4, slot5, slot6];
    var competelist = "";
    for (var i = 0;i<slots.length;i++) {
      var currSlot = slots[i];
      for (var j = 0;j<currSlot.length;j++) {
        //competelist = competelist + " " + i + " " + currSlot[j];

      }
    }

    var urlsMappings = [];
    var listMappings = [];
    var pointerMappings = [];
    var listMap = [];
    for (var i = 0;i<slots.length;i++) {
      var currSlot = slots[i];
      var currList = null;
      var currPointer = 0;
      if (currSlot.length === 1) {
        var exists = false;
          for (var k = 0; k< urlsMappings.length;k++) {
            var currUrlMapping = urlsMappings[k];
            if (currUrlMapping.url === currSlot[0]) {
              exists = true;
              currList = currUrlMapping.list;
              currPointer = currUrlMapping.pointer;
              competelist = competelist + "value of the url is " + currList.findAt(0);
              break;
            }
          }
           if (!exists) {
             currList = new LinkedList();
             currPointer = 0;
             for (var j= 0;j<currSlot.length;j++) {
               const adsData = await fetch(currSlot[j]);
               const adsJson = await adsData.json();

               for (var k=0;k<adsJson["data"].length;k++) {
                 if (adsJson["data"][k]["EMERGENCY"]==="Yes") {
                   currList.insertFirst({
                       "url":adsJson["data"][k]["Published Link"],
                       "duration": adsJson["data"][k]["duration"]
                 })
                 } else if(adsJson["data"][k]["NATIONAL"]==="Yes" ||
                     adsJson["data"][k]["store number"]===storeid) {
                   currList.insert({
                     "url":adsJson["data"][k]["Published Link"],
                     "duration": adsJson["data"][k]["duration"]
                   })
                 }
               }
               }
             }
             urlsMappings[urlsMappings.length] =  {"url":currSlot[0], "list":currList, "pointer":currPointer};
      } else {
        currList = new LinkedList();
        currPointer = 0;
        for (var j= 0;j<currSlot.length;j++) {
          const adsData = await fetch(currSlot[j]);
          const adsJson = await adsData.json();

          for (var k=0;k<adsJson["data"].length;k++) {
            if (adsJson["data"][k]["EMERGENCY"]==="Yes") {
              currList.insertFirst({
                "url":adsJson["data"][k]["Published Link"],
                "duration": adsJson["data"][k]["duration"]
              })
            } else if(adsJson["data"][k]["NATIONAL"]==="Yes" ||
                adsJson["data"][k]["store number"]===storeid) {
              currList.insert({
                "url":adsJson["data"][k]["Published Link"],
                "duration": adsJson["data"][k]["duration"]
              })
            }
          }
        }
      }
      listMappings[i] = currList;
      pointerMappings[i] = currPointer;
    }

    /*var outputstr = [];
    for (var i = 0;i<6;i++) {
      var currList = listMappings[i];
      var urls = [];
      for (var j = 0;j<currList.getSize();j++) {
        urls[j] = JSON.parse(currList.findAt(j)).url;
      }
      outputstr[i] = {"index":i,"urls":urls}
    }*/
    var playlist = []
    var pointers = [0, 0, 0, 0, 0, 0]
    //var outputstr = "";
    for (var i = 0;i<numofslot;i++) {
      var slotnumber = i % 6;
      if (slotnumber === 1) {
        slotnumber = 0;
      }
      var currPointer = pointers[slotnumber];
      var currList = listMappings[slotnumber];
      if (currPointer < currList.getSize()) {
        //outputstr = outputstr + " current point is " + currPointer;
        var nodeData = JSON.parse(currList.findAt(currPointer));
        playlist[i] = {"Published Link":nodeData.url, "Duration":nodeData.duration}
        pointers[slotnumber] = currPointer + 1;
      } else {
        currPointer = 0;
        var nodeData = JSON.parse(currList.findAt(currPointer));
        playlist[i] = {"Published Link":nodeData.url, "Duration":nodeData.duration}
        pointers[slotnumber] = currPointer + 1;
      }
    }

    const res = JSON.stringify({"data":playlist});// +name + " " + place //await fetch(apiEndpoint)
    const response = {
      statusCode: 200,
      body: res
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
