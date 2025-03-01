// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract ovote {
  // make an object for surveys 
  struct survey {
    uint id;
    string title;
    string description;
    address owner;
    string[][] answers;
    bool whiteListed;
    address[] whiteListedAddrs;
    address[] voted;
  }

  // main array for all surveys
  survey[] private allSurveys;

  // a function for appending surveys to main array
  function appendSurvey(string memory _title, string memory _description, bool _whiteListed, address[] memory _whiteListedAddrs, string[] memory _anstitle, string[] memory _voteN) public {
    string[][] memory _answers = new string[][](_anstitle.length);
    address[] memory emptyArr;

    for (uint i = 0; i < _anstitle.length; i++){
      string[] memory _ans = new string[](2);
      _ans[0] = _anstitle[i]; _ans[1] = _voteN[i];
      _answers[i] = _ans;
    }

    allSurveys.push(survey(allSurveys.length, _title, _description, msg.sender, _answers, _whiteListed, _whiteListedAddrs, emptyArr));
  }

  // a function for rendering main page (public user)
  function viewSurveys() public view returns (survey[] memory) {
    uint publicSurveysN = 0;

    for (uint i = 0; i < allSurveys.length; i++){
      if (allSurveys[i].whiteListed == false){
        publicSurveysN++;
      }
    }

    survey[] memory render_surveys = new survey[](publicSurveysN);
    uint j = 0;

    for (uint i = 0; i < allSurveys.length; i++){
      if (allSurveys[i].whiteListed == false){
        render_surveys[j] = allSurveys[i];
        j++;
      }
    }

    return render_surveys;
  }

  // a function for rendering main page (logined user)
  function viewSurveysByAddr(address _user) public view returns (survey[] memory){
    uint alowedSurveys = 0;

    for (uint i = 0; i < allSurveys.length; i++){
      if (allSurveys[i].whiteListed == false || isIn(allSurveys[i].whiteListedAddrs, _user)){
        alowedSurveys++;
      }
    }

    survey[] memory render_surveys = new survey[](alowedSurveys);
    uint j = 0;

    for (uint i = 0; i < allSurveys.length; i++){
      if (allSurveys[i].whiteListed == false || isIn(allSurveys[i].whiteListedAddrs, _user)){
        render_surveys[j] = allSurveys[i];
        j++;
      }
    }

    return render_surveys;
  }

  // a function for rendering dashboard
  function viewSurveysByOwner(address _owner) public view returns (survey[] memory){
    uint alowedSurveys = 0;

    for (uint i = 0; i < allSurveys.length; i++){
      if (allSurveys[i].owner == _owner){
        alowedSurveys++;
      }
    }

    survey[] memory render_surveys = new survey[](alowedSurveys);
    uint j = 0;

    for (uint i = 0; i < allSurveys.length; i++){
      if (allSurveys[i].owner == _owner){
        render_surveys[j] = allSurveys[i];
        j++;
      }
    }

    return render_surveys;
  }

  // a function for rendering a specified survey 
  function viewSurveyByID(uint _id) public view returns (survey memory){
    if (checkPermission(msg.sender, _id) == 1){
      return allSurveys[_id];
    }

    address[] memory emptyArr;
    string[][] memory semptyArr;
    return survey(0, '404', '$internalComunication false', msg.sender, semptyArr, false, emptyArr, emptyArr);
  }

  function checkPermission(address _user, uint _survey) public view returns (int){
    if (allSurveys[_survey].whiteListed == false || isIn(allSurveys[_survey].whiteListedAddrs, _user)){
      return 1;
    }
    else{
      return 0;
    }
  }
  
  // a function for voting surveys
  function vote(uint _id, uint _ansId) public {
    // if not in votted
    if(!isIn(allSurveys[_id].voted, msg.sender)){
      allSurveys[_id].voted.push(msg.sender);
      allSurveys[_id].answers[_ansId][1] = toString(toUint(allSurveys[_id].answers[_ansId][1]) + 1);
    }
  }

  // utility functions :
  
  function isIn(address[] memory _users, address _user) public pure returns(bool) {
    for (uint i = 0; i < _users.length; i++){
      if (_users[i] == _user){
        return true;
      }
    }
    return false;
  }

  function toString(uint256 value) internal pure returns (string memory) {
    if (value == 0) {
        return "0";
    }

    uint256 temp = value;
    uint256 digits;

    while (temp != 0) {
        digits++;
        temp /= 10;
    }

    bytes memory buffer = new bytes(digits);

    while (value != 0) {
        digits--;
        buffer[digits] = bytes1(uint8(48 + (value % 10)));
        value /= 10;
    }

    return string(buffer);
  }

  function toUint(string memory s) public pure returns (uint) {
    bytes memory b = bytes(s);
    uint result = 0;
    for (uint256 i = 0; i < b.length; i++) {
        uint256 c = uint256(uint8(b[i]));
        if (c >= 48 && c <= 57) {
            result = result * 10 + (c - 48);
        }
    }
    return result;
  }
}
