
var http = require('http');
var nodestatic = require('node-static');
var sys = require('util');
var path = require('path');
var url = require('url');
var exec = require('child_process').exec;
filesys = require("fs");

// Setup static server for current directory
var staticServer = new nodestatic.Server(".");

// Get temperature records from database




// Setup node http server
var server = http.createServer(
    // Our main server function


    function(request, response)
    {
        // Grab the URL requested by the client and parse any query options
        //var url = require('url').parse(request.url, true);
        var pathfile = url.pathname;
        var my_path = url.parse(request.url).pathname;
        var full_path =  path.join(process.cwd(),my_path);
        var query = url.query;
        var shutdown = "/shutdown";

        console.log('my_path: ' + my_path);

        if (my_path == '/shutdown'){
            console.log('Shutting down server');
            response.writeHead(200);
            child = exec("sudo shutdown -h now", function (error, stdout, stderr) {
                response.end("Shutdown...");
            return;
            });
        }

      // Serve index file.
        if (my_path == '/'){
            console.log('Requesting index file');
            path.exists(full_path + 'index.html',function(exists){
                if(!exists){
                    console.log('Error: index.html not found');
                    response.writeHeader(404, {"Content-Type": "text/plain"});
                    response.write("404 Not Found\n");
                    response.end();
                }
                else{

                    //response.writeHead(200, { "Content-type": "text/plain" });
                    filesys.readFile(full_path + 'index.html', "binary", function(err, file) {

                        if(err) {
                            response.writeHeader(500, {"Content-Type": "text/plain"});
                            response.write(err + "\n");
                            response.end();

                        }
                        else{
                            response.writeHeader(200);
                            response.write(file, "binary");
                            response.end();
                                               }
                    });

                }
            });
        }







      // Handler for favicon.ico requests
        if (pathfile == '/favicon.ico'){
            response.writeHead(200, {'Content-Type': 'image/x-icon'});
            response.end();

            // Optionally log favicon requests.
            //console.log('favicon requested');
            return;
        }


        else {
            // Print requested file to terminal
            console.log('Request from '+ request.connection.remoteAddress +' for: ' + pathfile);

            // Serve file using node-static
            staticServer.serve(request, response, function (err, result) {
                if (err){
                    // Log the error
                    sys.error("Error serving " + request.url + " - " + err.message);

                    // Respond to the client
                    response.writeHead(err.status, err.headers);
                    response.end('Error 404 - file not found');
                    return;
                }
                return;
            })
        }
    });

server.listen(8080);
// Log message
console.log('Server running at http://localhost:8080');
