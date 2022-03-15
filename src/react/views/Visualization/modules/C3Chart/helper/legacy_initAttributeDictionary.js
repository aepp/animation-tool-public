export function addToAttrDict(json_object) {
  // let applicationName = json_object.getProp("applicationName");
  // let recordingID = json_object.getProp("recordingID");
  // let attr;
  // let parts;
  // let data_section = "";
  let tempAttrDict = {};
  let attrDict = {};
  let annObjLen = -1;

  if (json_object['frames']) {
    for (let i in json_object['frames']) {
      if (json_object['frames'][i]) {
        for (let j in json_object
          ['frames']
          [i]['frameAttributes']) {
          if (!(j in tempAttrDict)) {
            tempAttrDict[j] = {};
          }
          tempAttrDict[j][
            json_object
              ['frames']
              [i]['frameStamp']
              .substring(0, 12)
            ] = json_object['frames'][i]['frameAttributes'][j];
        }
      }
    }
  } else if (json_object['intervals']) {
    // let jObjInt = json_object.getProp("intervals");
    // for (let el in jObjInt){
    //   jObjInt[el].class = 'rated';
    //   jObjInt[el].axis = 'x';
    //   if (jObjInt[el].hasOwnProperty('start') && jObjInt[el].hasOwnProperty('end')){
    //
    //     let begin = (parseFloat(moment.duration(jObjInt[el].start.substring(0,12)).asSeconds())).toFixed(2).toString();
    //     jObjInt[el].start = begin;
    //     let stop = (parseFloat(moment.duration(jObjInt[el].end.substring(0,12)).asSeconds())).toFixed(2).toString();
    //     jObjInt[el].end = stop;
    //     $("#intervalList").append("<option value='"+begin+", "+stop+"' data-section='saved internally'>"+ moment.duration(parseFloat(begin), 'seconds').format("hh:mm:ss.SSS")+" to "+moment.duration(parseFloat(stop), 'seconds').format("hh:mm:ss.SSS")+"</option>");
    //   }
    //   if (jObjInt[el].hasOwnProperty('annotations')){
    //     keys = Object.keys(jObjInt[el].annotations);
    //     for (k in keys){
    //       if (keys[k]!='axis' && keys[k]!='start' && keys[k]!='end' && keys[k]!='class'){
    //         if ($("input[name=inputKeyList][value="+keys[k]+"]").length==0){
    //           $("#keyValuePairList").append('<div class="keyValuePair"><label>'+keys[k]+'</label><input type="hidden" name="inputKeyList" value="'+keys[k]+'" /><input type="text" class="form-control input-sm smallInput" name="inputValueList" placeholder="Add value"/> <div class="deleteKeyValueLink small"><a href="#" class="deleteKeyValuePair">[X]</a></div></div> ');
    //         }
    //         jObjInt[el][keys[k]] = jObjInt[el].annotations[keys[k]];
    //       }
    //     }
    //     delete jObjInt[el].annotations;
    //   }
    // }
    // intervalList.reload();
    // // $("#intervalCount").text($('#intervalList option').length);
    // document.querySelector('#intervalCount').innerHTML = document.querySelectorAll('#intervalCount option').length;
    // regions = jObjInt;
    // chart.regions(regions);
  }

  // for (let i in Object.keys(tempAttrDict)){
  //console.log(Object.keys(tempAttrDict)[i]+" "+sum(tempAttrDict[Object.keys(tempAttrDict)[i]]));
  // data_section = applicationName;
  // attr = Object.keys(tempAttrDict)[i];
  // if ($("#attrTreeSelect option[value='"+attr+"']").length <= 0){ // check if it first exists
  //   if ((sum(tempAttrDict[attr])!==0 && !isNaN(sum(tempAttrDict[attr]))) || stringObj(tempAttrDict[attr])){
  //     parts = attr.split("_");
  //     if (parts.length>1) {
  //       for (let p=0; p<parts.length-1; p++) data_section += "/"+ parts[p];
  //     }
  //     let html = "<option value='"+attr+"' data-section='"+data_section+"'>"+parts[parts.length-1]+"</option>";
  //     $("#attrTreeSelect").append(html);
  //   }
  //
  // }
  // }
  attrDict = Object.assign(attrDict, tempAttrDict);

  // Determine max time-length (max key for each attribute in the attrDict)
  for (let i in attrDict) {
    if (getMax(attrDict[i]) > annObjLen) {
      annObjLen = getMax(attrDict[i]);
    }
  }

  return attrDict;
  // in case this Application contains 'GPS' means it is a map
  // if( applicationName.indexOf('GPS') >= 0 || applicationName.indexOf('gps') >= 0){
  //   mapIsActive = true;
  //   replaceVideoWithMap(tempAttrDict,recordingID);
  // }
}

function toDurationS(time) {
  let result = 0;
  let spl = time.split(':');
  if (spl.length === 3) {
    result =
      parseFloat(spl[2]) + parseFloat(spl[1]) * 60 + parseFloat(spl[0]) * 3600;
  } else {
    console.log('Invalid time format in toDurationS ');
  }
  return result;
}

function getMax(obj) {
  return Math.max.apply(null, Object.keys(obj).map(toDurationS));
}

