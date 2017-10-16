/* This file is the js file for assign3Chenzhu.html, which is Mountain View Travel Agency customer questionary page. */
/* Author: Chen Zhu */
/* Version: 1.0 */
/* Last modify time: 09/10/2017 */

//regular expression for checking every input field
//and warning description when input is invalid.
var regFirstname=/^[/t ]*\w{1,20}[/t ]*$/;
var warningFirstname="    Invalid. Please input 1 to 20 character.";
var regLastname=/^[/t ]*\w{1,20}[/t ]*$/;
var warningLastname="    Invalid. Please input 1 to 20 character.";
var regGender=/^[/t ]*.{1,20}[/t ]*$/;
var warningGender="    Invalid. Please Choose or input a gender(less than 20 characters).";
var regOccupation=/^[/t ]*\w{1,20}[/t ]*$/;
var warningOccupation="    Invalid. Please input 1 to 20 character.";
var regPostaladdress=/^[/t ]*\w{1,100}[/t ]*$/;
var warningPostaladdress="    Invalid. Please input 1 to 200 character.";
var regPostcode=/^[/t ]*\d{4,4}[/t ]*$/;
var warningPostcode="    Invalid. Please input 4 digits.";
var regPhonenum=/^[/t ]*\d{10,10}[/t ]*$/;
var warningPhonenum="    Invalid. Please input 10 digits.";
var regEmailaddress=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var warningEmailaddress="    Invalid. Please input valid email address, like name@gmail.com.";
var warningDob="    Invalid. Valid age is 0 - 100 yrs.";
var warningTravedate="    Invalid. Should be after today and in three years";

//validation indicator for each input field
//section 1's validation indicator
var indicator1={firstname:false,
                lastname:false,
                gender:false,
                dob:false,
                occupation:false,
                postal:false,
                postcode:false,
                phone:false,
                email:false};
//section 2's validation indicator,partner     
var indicator2={firstname:false,
                lastname:false,
                gender:false,
                dob:false,
                occupation:false
                };
//section 3's validation indicator,child    
var bChildIndicator=[];
var bChildrenValidation=[false,false,false];
//section 4's validation indicator                
var indicator4 = false;
//section index
var sectionArray = ["#section1", "#section2", "#section3", "#section4", "#section5"];
var sectionNum = sectionArray.length;
var sectionId = 0; // indicator for recording the curring section number

// partner html element module
var personalInfo='<p class="label"><label id="labelvarfirstname" for="varfirstname">Partner\'s First Name:&nbsp;&nbsp;<button class="helper" id="helper_10_1" type="button">?</button></label></p>\n\
                    <div class="tips" id="tips_10_1">\n\
                    <p>Input  first name.</p>\n\
                    <p>First name should not be more than 20 characters.</p>\n\
                    </div>\n\
                <input type="text" id="varfirstname" name="varfirstname" required="required" placeholder="Input First Name." size="40"/>\n\
                <p class="label"><label id="labelvarlastname" for="varlastname">Partner\'s Last Name:&nbsp;&nbsp;<button class="helper" id="helper_10_2" type="button">?</button></label></p>\n\
                <div class="tips" id="tips_10_2">\n\
                    <p>Input  last name.</p>\n\
                    <p>Last name should not be more than 20 characters.</p>\n\
                </div>\n\
                <input type="text" id="varlastname" name="varlastname" required="required" placeholder="Input Last Name." size="40"/>\n\
                <p class="label"><label id="labelvargender" for="vargender">Partner\'s Gender:&nbsp;&nbsp;<button class="helper" id="helper_10_3" type="button">?</button></label></p>\n\
                <div class="tips" id="tips_10_3">\n\
                    <p>Input gender.</p>\n\
                    <p>Choose your gender form the pull down list, or input your gender.</p>\n\
                    <p>Your gender description should not be more than 20 characters</p>\n\
                </div>\n\
                <input id="vargender" list="partnergenderlist" placeholder="Choose Gender" name="vargender">\n\
                <datalist id="partnergenderlist">\n\
                    <option value="male"/>\n\
                    <option value="female"/>\n\
                    <option value="transgender"/>\n\
                    <option value="male-to-female"/>\n\
                    <option value="female-to-male"/>\n\
                    <option value="gender diverse"/>\n\
                    <option value="intersex"/>\n\
                </datalist>\n\
                <p class="label"><label id="labelvarbirthday" for="varbirthday">Partner\'s Date of Birth:&nbsp;&nbsp;<button class="helper" id="helper_10_4" type="button">?</button></label></p>\n\
                <div class="tips" id="tips_10_4">\n\
                    <p>Input birthday.</p>\n\
                    <p>Choose birthday form the data picker.</p>\n\
                    <p>Your age should be between 0 and 100 yrs.</p>\n\
                </div>\n\
                <input type="date" id="varbirthday" name="varbirthday" required="required" size="40"/>\n\
                <p class="label"><label id="labelvaroccupation" for="varoccupation">Partner\'s Occupation:&nbsp;&nbsp;<button class="helper" id="helper_10_5" type="button">?</button></label></p>\n\
                <div class="tips" id="tips_10_5">\n\
                    <p>Input occupation.</p>\n\
                    <p>Your occupation should not be more than 20 characters.</p>\n\
                </div>\n\
                <input type="text" id="varoccupation" name="varoccupation" required="required" placeholder="Input Occupation." size="40"/>';

// add child html element module
var childrenInfo='<fieldset id="childindex">\n\
                <legend>The childNum child.</legend>\n\
                <p class="label"><label id="labelvarfirstname" for="varfirstname">First Name:&nbsp;&nbsp;<button class="helper" id="helper_11_1_helpindex" type="button">?</button></label></p>\n\
               <div class="tips" id="tips_11_1_helpindex">\n\
                    <p>Input  first name.</p>\n\
                    <p>First name should not be more than 20 characters.</p>\n\
                    </div>\n\
<input type="text" class="childFirstname" id="varfirstname" name="varfirstname" required="required" placeholder="Input first name." size="40"/>\n\
                <p class="label"><label id="labelvarlastname" for="varlastname">Last Name:&nbsp;&nbsp;<button class="helper" id="helper_11_2_helpindex" type="button">?</button></label></p>\n\
               <div class="tips" id="tips_11_2_helpindex">\n\
                    <p>Input last name.</p>\n\
                    <p>Last name should not be more than 20 characters.</p>\n\
                    </div>\n\
<input type="text" class="childLastname" id="varlastname" name="varlastname" required="required" placeholder="Input last name." size="40"/>\n\
                <p class="label"><label id="labelvargender" for="vargender">Gender:&nbsp;&nbsp;<button class="helper" id="helper_11_3_helpindex" type="button">?</button></label></p>\n\
                   <div class="tips" id="tips_11_3_helpindex">\n\
                    <p>Choose a gender for your child.</p>\n\
                    </div>\n\
<input type="radio" id="haveChildren" name="childrenvargender" value="boy" checked><span class="radiotext" id="childrenYes">Boy</span>\n\
                <input type="radio" id="haveNoChildren" name="childrenvargender" value="girl" ><span class="radiotext" id="childrenNo">Girl</span><br>\n\
                <p class="label"><label id="labelvarbirthday" for="varbirthday">Dad of Birth:&nbsp;&nbsp;<button class="helper" id="helper_11_4_helpindex" type="button">?</button></label></p>\n\
                                <div class="tips" id="tips_11_4_helpindex">\n\
                    <p>Input birthday.</p>\n\
                    <p>Choose birthday form the data picker.</p>\n\
                    <p>Your age should be between 0 and 100 yrs.</p>\n\
                </div>\n\
<input type="date" class="childBirthday" id="varbirthday" name="varbirthday" required="required" size="40"/>\n\
                <p><button class="deleteChild">Delete</button></p>\n\
                </fieldset>';

// child index indicator 
var childIndex = 1;

//update the displayed section, display section whose sectionId equals id
function DisplaySection(id) {
    var i;
    for (i = 0; i < sectionNum; i++)
    {
        if (i === id)
        {
            $(sectionArray[i]).show();
        } else
        {
            $(sectionArray[i]).hide();
        }
    }
}

//update progress indicator color
function UpdateIndicator(index) 
{
	var busy="#F08080";
	var idle="#B0E0E6";
	var i = "#progress_" + (index + 1);
	$("#progress_1").css("background-color",idle);
	$("#progress_2").css("background-color",idle);
	$("#progress_3").css("background-color",idle);
	$("#progress_4").css("background-color",idle);
	$("#progress_5").css("background-color",idle);
    $(i).css("background-color",busy);
}

$(document).ready(function () {
    DisplaySection(sectionId);      //show section 1 initially
    
    // initiall status of next, previous and submit button
    $(".next").prop('disabled', false);
    $(".previous").prop('disabled', true);
    $(".submit").prop('disabled', true);

    //adjust the width of 3 control button.
    var prewidth = $(".previous").width();
    $(".next,.submit").width(prewidth);
   
   //click next button
   //validate current page, switch the next page if all fields are validation.
    $(".next").click(function () {
        //validate section1
        if (sectionId === 0)
        {
			validatSection1();
            if (!clearErrorInSection1())
            {
                //insert warning information
                if (!($("#errorIn").length)){
                    var eleError = $('<p id="errorIn">Some inputs are invalid.Try again.</p>');                  
                    eleError.css({                        
                        color:"red",
                        fontSize:"12px",
                        marginTop:"5px",
                        marginBottom: "1px",
                        textAlign: "right"});
                    eleError.insertBefore($("#formOperation"));
                }
                return;
            }
        }
        else if (sectionId === 1 && $('input[name=partner]:checked', '#form1').val() === "Yes"  )
        {
			  validatSection2();
            if (!clearErrorInSection2())
			{
                //insert warning information
                if (!($("#errorIn").length)){
                    var eleError = $('<p id="errorIn">Some inputs are invalid.Try again.</p>');                  
                    eleError.css({                        
                        color:"red",
                        fontSize:"12px",
                        marginTop:"5px",
                        marginBottom: "1px",
                        textAlign: "right"});
                    eleError.insertBefore($("#formOperation"));
                }
                return;
            }
        }
        else if (sectionId === 2 && $('input[name=children]:checked', '#form1').val() === "Yes" )
        {
            //validate section 3, child section
			validatSection3();
            if (!clearErrorInSection3())
            {
                //add warning information
                if (!($("#errorIn").length)){
                    var eleError = $('<p id="errorIn">Some inputs are invalid.Try again.</p>');                  
                    eleError.css({                        
                        color:"red",
                        fontSize:"12px",
                        marginTop:"5px",
                        marginBottom: "1px",
                        textAlign: "right"});
                    eleError.insertBefore($("#formOperation"));
                }
                return;
            }             
                
        }    
         else if (sectionId === 3)
         {
             //validate section 4
			 indicator4 = validateTraveDate(document.getElementById("taveeldate"), warningTravedate);
             if (!indicator4)
             {
                 //insert warning information
                 if (!($("#errorIn").length)){
                    var eleError = $('<p id="errorIn">Some inputs are invalid.Try again.</p>');                  
                    eleError.css({                        
                        color:"red",
                        fontSize:"12px",
                        marginTop:"5px",
                        marginBottom: "1px",
                        textAlign: "right"});
                    eleError.insertBefore($("#formOperation"));
                }
                return;
             }
         }
        if (sectionId === sectionNum - 1)
        {
            return;
        }
        sectionId++;
        //update progress bar
		UpdateIndicator(sectionId);
        switch (sectionId)
        {
            case 0:
                $(".progressID").val(0);
                break;
            case 1:
                $(".progressID").val(9);
                break;
            case 2:
                $(".progressID").val(10);
                break;
            case 3:
                $(".progressID").val(16);
                break;
            case 4:
                $(".progressID").val(23);
                break;                
        }
        //switch to next section
        DisplaySection(sectionId);
       $(".previous").prop('disabled', false);
        if (sectionId === sectionNum - 1) {
            $(".next").prop('disabled', true);
            $(".submit").prop('disabled', false);
        }
    });
	


    //click previous button
    $(".previous").click(function () {
        if (sectionId === 0)
        {
            return;
        }
        sectionId--;
	    UpdateIndicator(sectionId);
        switch (sectionId)
        {
            case 0:
                $(".progressID").val(0);
                break;
            case 1:
                $(".progressID").val(9);
                break;
            case 2:
                $(".progressID").val(10);
                break;
            case 3:
                $(".progressID").val(16);
                break;
            case 4:
                $(".progressID").val(23);
                break;                
        }
        DisplaySection(sectionId);
        $(".next").prop('disabled', false);
        $(".submit").prop('disabled', true);
        if (sectionId === 0)
        {
            $(".previous").prop('disabled', true);
        }       
    });
    
    //click help button
    $(document).on("click", ".helper", function(){
        //get the id of button
        var l = $(this).attr("id");
        var  tipId = "#tips" + l.substr(6);
        if ($(tipId).css('display') === 'none') {
            //show help information
            $(tipId).css({display: "block"});
        } else {
            //hide help information
            $(tipId).css({display: "none"});
        }
        });
    
    //Check the validation of partnerfirstname input feild
    $(document).on("blur", "#partnerfirstname", function(){
       indicator2.firstname = validate(document.getElementById("partnerfirstname"),regFirstname,warningFirstname);
       clearErrorInSection2();
    });
    //Check the validation of partnerlastname input feild
    $(document).on("blur", "#partnerlastname", function(){
         indicator2.lastname = validate(document.getElementById("partnerlastname"),regLastname,warningLastname);
         clearErrorInSection2();
    });
    //Check the validation of partnergender input feild
    $(document).on("blur", "#partnergender", function(){
         indicator2.gender = validate(document.getElementById("partnergender"),regGender,warningGender);
         clearErrorInSection2();
    });
    //Check the validation of partnerbirthday input feild
    $(document).on("blur", "#partnerbirthday", function(){
         indicator2.dob = validateDob(document.getElementById("partnerbirthday"),warningDob);       
         clearErrorInSection2();
    });
    //Check the validation of partneroccupation input feild
    $(document).on("blur", "#partneroccupation", function(){
         indicator2.occupation = validate(document.getElementById("partneroccupation"),regOccupation,warningOccupation);
         clearErrorInSection2();
    });
    
    
    //check the validation of child's firstname
    $(document).on("blur", ".childFirstname", function(){
       var childid=$(this).parent().attr("id");
       var i;
       for (i in bChildIndicator)
       {
           if (bChildIndicator[i].firstName === childid)
               break;
       }       
       bChildIndicator[i].indicator[0] = validate(document.getElementById($(this).attr("id")),regFirstname,warningFirstname);
       clearErrorInSection3();
    });

    //check the validation of child's lastname
    $(document).on("blur", ".childLastname", function(){
        var childid=$(this).parent().attr("id");
       var i;
       for (i in bChildIndicator)
       {
           if (bChildIndicator[i].firstName === childid)
               break;
       } 
         bChildIndicator[i].indicator[1] = validate(document.getElementById($(this).attr("id")),regLastname,warningLastname);
         clearErrorInSection3();
    });
    
    //check the validation of child's birthday
    $(document).on("blur", ".childBirthday", function(){
                var childid=$(this).parent().attr("id");
       var i;
       for (i in bChildIndicator)
       {
           if (bChildIndicator[i].firstName === childid)
               break;
       } 
         bChildIndicator[i].indicator[2] = validateDob(document.getElementById($(this).attr("id")),warningDob);   
         clearErrorInSection3();
    });
    
    //delete a child
    $(document).on("click", ".deleteChild", function(){
            var eleChild = $(this).parent().parent();
            var id=eleChild.attr("id");
            var index = Number(id.substr(5)) - 1;
            var i;
            for (i in bChildIndicator)
            {
                if (bChildIndicator[i].firstName === id)
                     bChildIndicator.splice(index,1);
            }                 
            eleChild.remove();            
        });
    //Click partner radio
    $('input[type=radio][name=partner]').change(function () { 
            //have partner
            if (this.value === 'Yes') {   
            //Create person information input interface
                var fieldset = $('<div id="partnerfieldset"/>');
                var personInfoNode = $(personalInfo.replace(/varfirstname/g, "partnerfirstname")
                    .replace(/varlastname/g,"partnerlastname")
                    .replace(/vargender/g,"partnergender")
                    .replace(/varbirthday/g,"partnerbirthday")
                    .replace(/varoccupation/g,"partneroccupation"));
                fieldset.append(personInfoNode);
                fieldset.appendTo($("#section2"));
            }
            else{
                //have no partner
                $('#partnerfieldset').remove();
            }
        }); 

         //Click Have children radio button
    $('input[type=radio][name=children]').change(function () { 
            //have partner
            if (this.value === 'Yes') {  
                var childname="child"+childIndex;                
                var objChild = {
                    firstName:childname,
                    indicator:bChildrenValidation
                };
                bChildIndicator.push(objChild);
                   var childhtml = childrenInfo.replace(/index/g,childIndex)
                    .replace(/childNum/g,childIndex)
                    .replace(/helpindex/g,childIndex)
                    .replace(/varfirstname/g,"firstname_" + childIndex)
                    .replace(/varlastname/g,"lastname_" + childIndex)
                    .replace(/vargender/g,"gender_" + childIndex)
                    .replace(/varbirthday/g,"birthday_" + childIndex);
                    childIndex++;
                    var divChildren=$("<div/>").addClass("childrenSection");
                    var eleChild = $(childhtml);
                    var buttonAdd = $("<button>Add a child</button>").attr("id","buttonAddChild");
                    var lineButton = $("</p>").addClass("childAddline");
                    lineButton.append(buttonAdd);            
                    divChildren.append(eleChild).append(lineButton);
                    $("#section3").append(divChildren);
            }
            else{
                //have no child
				bChildIndicator = [];
				childIndex = 1;
                $('.childrenSection').remove();
            }
        }); 
        
    //click add child button, add a child
    $(document).on("click", "#buttonAddChild", function(){
             
        var childname = "child" + childIndex;
        var objChild = {
            firstName: childname,
            indicator: bChildrenValidation
        };
        bChildIndicator.push(objChild);
        var childhtml = childrenInfo.replace(/index/g, childIndex)
                .replace(/childNum/g, childIndex)
                .replace(/varfirstname/g, "firstname_" + childIndex)
                .replace(/varlastname/g, "lastname_" + childIndex)
                .replace(/vargender/g, "gender_" + childIndex)
                .replace(/varbirthday/g, "birthday_" + childIndex);
        childIndex++;
        var eleChild = $(childhtml);
        eleChild.insertBefore($(".childAddline"));
         });
});

//check section 1
function validatSection1()
{
	indicator1.firstname = validate(document.getElementById("firstname"), regFirstname, warningFirstname);
    indicator1.lastname = validate(document.getElementById("lastname"), regLastname, warningLastname);  
    indicator1.gender = validate(document.getElementById("gender"), regGender, warningGender);  
    indicator1.dob = validateDob(document.getElementById("birthday"), warningDob);  
    indicator1.occupation = validate(document.getElementById("occupation"), regOccupation, warningOccupation);
    indicator1.postal = validate(document.getElementById("postaladdress"), regPostaladdress, warningPostaladdress); 
    indicator1.postcode = validate(document.getElementById("postcode"), regPostcode, warningPostcode); 
    indicator1.email = validate(document.getElementById("emailaddress"), regEmailaddress, warningEmailaddress); 
    indicator1.phone = validate(document.getElementById("phonenum"), regPhonenum, warningPhonenum);
}
//update section1's invalidation indictor status.
function clearErrorInSection1()
{

    if (indicator1.firstname &&
        indicator1.lastname &&
        indicator1.gender &&
        indicator1.occupation &&
        indicator1.postal &&
        indicator1.postcode &&
        indicator1.phone)
    {
        $("#errorIn").remove();
        return true;
    }
    return false;
}

//section 2
function validatSection2()
{
	indicator2.firstname = validate(document.getElementById("partnerfirstname"),regFirstname,warningFirstname);
   indicator2.lastname = validate(document.getElementById("partnerlastname"),regLastname,warningLastname);
   indicator2.gender = validate(document.getElementById("partnergender"),regGender,warningGender);
         indicator2.dob = validateDob(document.getElementById("partnerbirthday"),warningDob);       
      indicator2.occupation = validate(document.getElementById("partneroccupation"),regOccupation,warningOccupation);
     
}
//update section2's invalidation indictor status.
function clearErrorInSection2()
{
	   //Check the validation of partnerfirstname input feild
    if (indicator2.firstname &&
        indicator2.lastname &&
        indicator2.dob &&
        indicator2.gender &&
        indicator2.occupation
        )
    {
        $("#errorIn").remove();
        return true;
    }
    return false;
}

//section 3
function validatSection3()
{
	var i;
	var firstname_id,lastname_id,birthday_id,childIndex;
	for (i in bChildIndicator)
	{
		childIndex = bChildIndicator[i].firstName.substr(5);
		firstname_id = "firstname_" + childIndex; 		
		lastname_id = "lastname_" + childIndex;
		birthday_id = "birthday_" + childIndex;
		bChildIndicator[i].indicator[0] = validate(document.getElementById(firstname_id),regFirstname,warningFirstname);
		bChildIndicator[i].indicator[1] = validate(document.getElementById(lastname_id),regFirstname,warningFirstname);
		bChildIndicator[i].indicator[2] = validateDob(document.getElementById(birthday_id),warningDob); 
	}
     
}
//update section3's invalidation indictor status.
function clearErrorInSection3()
{
    var i;
    for (i in bChildIndicator)
    {
        if (!(bChildIndicator[i].indicator[0] && bChildIndicator[i].indicator[1] && bChildIndicator[i].indicator[2]))
        {
            return false;
        }
    }
     $("#errorIn").remove();
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    
    //Check the invalidation when the focus removed
    document.getElementById("firstname").addEventListener("blur",checkFirstname);
    document.getElementById("lastname").addEventListener("blur",checkLastname);
    document.getElementById("gender").addEventListener("blur",checkGender);
    document.getElementById("birthday").addEventListener("blur",checkDOB );
    document.getElementById("occupation").addEventListener("blur",checkOccupation);
    document.getElementById("postaladdress").addEventListener("blur",checkPostaladdress);
    document.getElementById("postcode").addEventListener("blur",checkPostcode);
    document.getElementById("phonenum").addEventListener("blur",checkPhonenum);   
    document.getElementById("emailaddress").addEventListener("blur",checkEmailaddress);  
    document.getElementById("taveeldate").addEventListener("blur",checkTraveDate);
});

//check value in text input element
//node: the text input element
//regexp: the regular expression used to check the validation
//info: the warning info if it is invalid
function validate(node, regexp, info)
{
    input = node.value;
    var strid = node.getAttribute("id");
    var strNodeId = "span" + strid;

    if (!regexp.test(input))
    {
        //input value is illage, a warning beside the label.
        if (!document.getElementById(strNodeId))
        {
            var para = document.createElement("span");
            para.setAttribute("id", strNodeId);
            var node = document.createTextNode(info);
            para.appendChild(node);
            para.style.color = "red";
            insertAfter(para, document.getElementById("label" + strid));
        }
        return false;
    } else
    {
        //input value is validated, so delete the warning.
        var el = document.getElementById(strNodeId);
        if (typeof (el) !== 'undefined' && el !== null)
        {
            el.parentNode.removeChild(el);
        }
        return true;
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
//check value in date input element
//node: the datinpu t element
//info: the warning info if it is invalid
function validateDob(node, info)
{
    var dob = node.value;
    var dobdate = new Date(dob);
    var maxdate = new Date();
    var mindate = new Date(maxdate);
    mindate.setFullYear(maxdate.getFullYear() - 100);
    var strid = node.getAttribute("id");
    var strNodeId = "span" + strid;
    //The valid age is 0 - 100 years old
    if (dob === "" || dobdate > maxdate || dobdate < mindate)
    {
        //input value is illage, a warning beside the label.
        if (!document.getElementById(strNodeId))
        {
            var para = document.createElement("span");
            para.setAttribute("id", strNodeId);
            var node = document.createTextNode(info);
            para.appendChild(node);
            para.style.color = "red";
            insertAfter(para, document.getElementById("label" + strid));
        }
        return false;
    } else
    {
        //input value is validated, so delete the warning.
        var el = document.getElementById(strNodeId);
        if (typeof (el) !== 'undefined' && el !== null)
        {
            el.parentNode.removeChild(el);
        }
        return true;
    }
}

//validate date
//node: the datinpu t element
//info: the warning info if it is invalid
function validateTraveDate(node, info)
{
    var dob = node.value;
    var dobdate = new Date(dob);
    var maxdate = new Date();
    var mindate = new Date(maxdate);
    maxdate.setFullYear(maxdate.getFullYear() + 3);
    var strid = node.getAttribute("id");
    var strNodeId = "span" + strid;
    //The valid age is 0 - 100 years old
    if (dob === "" || dobdate > maxdate || dobdate < mindate)
    {
        //input value is illage, a warning beside the label.
        if (!document.getElementById(strNodeId))
        {
            var para = document.createElement("span");
            para.setAttribute("id", strNodeId);
            var node = document.createTextNode(info);
            para.appendChild(node);
            para.style.color = "red";
            insertAfter(para, document.getElementById("label" + strid));
        }
        return false;
    } else
    {
        //input value is validated, so delete the warning.
        var el = document.getElementById(strNodeId);
        if (typeof (el) !== 'undefined' && el !== null)
        {
            el.parentNode.removeChild(el);
        }
        return true;
    }
}

//check trave date    
function checkTraveDate()
{
    indicator4 = validateTraveDate(document.getElementById("taveeldate"), warningTravedate);
    clearErrorInSection1();

}
//callback function
//check the validation of Firstname field 
function checkFirstname()
{
    indicator1.firstname = validate(document.getElementById("firstname"), regFirstname, warningFirstname);
    clearErrorInSection1();
}

//callback function
//check the validation of Firstname field 
function checkLastname()
{
    indicator1.lastname = validate(document.getElementById("lastname"), regLastname, warningLastname);
    clearErrorInSection1();
}
function checkGender()
{
    indicator1.gender = validate(document.getElementById("gender"), regGender, warningGender);
    clearErrorInSection1();
}
//callback function
//check the validation of dob field
function checkDOB()
{
    indicator1.dob = validateDob(document.getElementById("birthday"), warningDob);
    clearErrorInSection1();
}

//callback function
//check the validation of Occupation field
function checkOccupation()
{
    indicator1.occupation = validate(document.getElementById("occupation"), regOccupation, warningOccupation);
    clearErrorInSection1();
}
//
//callback function
//check the validation of Postaladdress field
function checkPostaladdress()
{
    indicator1.postal = validate(document.getElementById("postaladdress"), regPostaladdress, warningPostaladdress);
    clearErrorInSection1();
}

//callback function
//check the validation of Postcode field
function checkPostcode()
{
    indicator1.postcode = validate(document.getElementById("postcode"), regPostcode, warningPostcode);
    clearErrorInSection1();
}

//callback function
//check the validation of Emailaddress field
function checkEmailaddress()
{
    indicator1.email = validate(document.getElementById("emailaddress"), regEmailaddress, warningEmailaddress);
    clearErrorInSection1();
}

//callback function
//check the validation of Phonenum
function checkPhonenum()
{
    indicator1.phone = validate(document.getElementById("phonenum"), regPhonenum, warningPhonenum);
    clearErrorInSection1();
}