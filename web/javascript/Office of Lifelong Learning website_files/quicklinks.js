function jumpMenu(){

var strURL=document.forms[0].menu.options[document.forms[0].menu.selectedIndex].value;

if (strURL.length>0)
  location=strURL;

}

document.writeln('<form action="">');
document.writeln('<font face="arial" size="-1">');
document.writeln('<select name="menu" class="quicklinks" onchange="JavaScript:jumpMenu();">');
document.writeln('  <option value="">Quick Links</option>');
document.writeln('  <option value="">-------------------</option>');
document.writeln('  <option value="/cpe/access/">Access Course</option>');
document.writeln('  <option value="/cpe/brochure.html">Brochure</option>');
document.writeln('  <option value="/cpe/opens/cert.html">Certificate</option>');
document.writeln('  <option value="/about/contact.html">Contact Us</option>');
document.writeln('  <option value="/cpe/creditentry.html">Credit for Entry</option>');
document.writeln('  <option value="/cpe/enrolment.html">How to Enrol</option>');
document.writeln('  <option value="/cpe/opens/newh.html">New Horizons</option>');
document.writeln('  <option value="/cpe/opens/courses">Open Studies Courses</option>');
document.writeln('  <option value="/cpe/opens/summer2004/">Summer courses 2004</option>');
document.writeln('  <option value="/cpd/">Professional Development</option>');
document.writeln('  <option value="/cptu/">Children\'s Panel Training Unit</option>');
document.writeln('</select>');
document.writeln('<a href="javascript:jumpMenu();"><img src="/system/images/golink.gif" border="0" alt="Go to the selection"></a>&nbsp;');
document.writeln('</font>');
