/*

    JavaScript Trace/Debug Utility

This script creates a debugging window which is used by the following two functions:


    debug(variable,variable_name,comment);

Insert this anywhere you wish to track a variable. It prints out a description of the object and all its properties. variable_name and comment are optional.


    trace(comment);
    
Insert this inside your functions. It prints out the name of the function and the arguments it was called with. comment is optional.


To use the debugger, save this file as debug.js, then include it in your HTML pages using the tag:
   <script src=debug.js></script>
Then switch debugging/tracing on by setting the variables:
    DEBUG = true;
    TRACE = true;
Debugging/tracing can be switched on and off at different stages as desired by changing these variables.

This debugger is supplied free of charge but without any guarantees, etc. Usual small print applies. (c)D.WInterstein, 2002

Please send any comments, requests, constructive criticism or plain abuse to danielw@dai.ed.ac.uk  Also please tell me if you write an improved version.

*/

    DEBUG = true;
    TRACE = true;

if (!debug_window) {
    var debug_window = window.open("","debug_window","resizable=yes,scrollbars=yes,width=300,height=300");
}

function trace(comment) {
    if (TRACE) {
        comment = comment || "";
        var fn = trace.caller;
        var fnt = fn.toString();
        var myArray = /function\s+(\w+)/.exec(fnt);
        fnt = myArray[1];
        var arg = fn.arguments;
        debug_window.document.write(fnt + " ( " + arg + " ) " + "<i>" + comment + "</i> <hr>" );
    }
}

function debug(obj,obj_name,comment) {
    if (DEBUG) {
        var text = "";
        if (!obj_name) {obj_name = "object";}
        if (!comment) {comment = "";}
        if (typeof(obj) == "object") {
            text = dump_props(obj, obj_name);
        } else {       
            text = obj + "<br>";
            if (obj_name) {text = obj_name + " = " + text;}
        }
        debug_window.document.write("<i>" + comment + "</i> " + text );
    }
}

function dump_props(obj, obj_name) {
    var result = ""
    for (var i in obj) {
        result += " - " + obj_name + "." + i + " = " + obj[i] + "<BR>"
    }
    result += "<HR>"
    return result
} 

debug_window.document.write("<hr><b>initialising debugger</b> (<a href=blank.html>clear</a>)<hr>");

// END OF FILE
