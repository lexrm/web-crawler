import {Router, Request, Response, NextFunction} from 'express';
import * as debug from 'debug';
const Data = require('../data');

var request = require('request');
var cheerio = require('cheerio');
//var url = require('url-parse'); 

export class CrawlerRouter {
  router: Router

  /**
   * Initialize the CrawlerRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }
  
  /**
   * GET all relative links
   */
  public getLinks(req: Request, res: Response, next: NextFunction) {    
    debugger;
    let pageToVisit = "http://www." + req.params.url;
    
    console.log("Visiting page " + pageToVisit);
    request(pageToVisit, function(error, response, body) {
       if(error) {
         console.log("Error: " + error);
       }
       // Check status code (200 is HTTP OK)
       console.log("Status code: " + response.statusCode);
       if(response.statusCode === 200) {
         // Parse the document body
         var $ = cheerio.load(body);
         console.log("Page title:  " + $('title').text());
       }

       var allRelativeLinks = collectInternalLinks($);
       
       if (allRelativeLinks.length) {
         res.status(200)
           .send({
             message: 'Success',
             status: res.status,
             allRelativeLinks
           });
       }
       else {
         res.status(404)
           .send({
             message: 'No links found with the given url.',
             status: res.status
           });
       }

       function collectInternalLinks($) {
        
          var allRelativeLinks = [];                  
          var relativeLinks = $("a[href^='/']");

          relativeLinks.each(function() {
              allRelativeLinks.push($(this).attr('href'));
        
          });
        
          console.log("Found " + allRelativeLinks.length + " relative links");      
          console.log("Links are: " + JSON.stringify(allRelativeLinks));      
    
          return allRelativeLinks;
      }

    });        
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {    
    this.router.get('/:url', this.getLinks);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const crawlerRoutes = new CrawlerRouter();
crawlerRoutes.init();

export default crawlerRoutes.router;
