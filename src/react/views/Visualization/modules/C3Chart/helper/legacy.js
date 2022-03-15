export const legacy = () => {
  // globalValues
  let chart;

  var $result = $("#sessionFileList");
  var $video;
  var mymap;
  var videoIsActive = false;
  var mapIsActive = false;
  var attrDict;
  var regions;
  var annObjLen;
  var annTf = 0.5; // annotatoom timeframe
  var sessionName;
  var zerotime;

  $("#sessionFile").on("change", function (evt) {
    // remove content
    $result.html("");
    attrDict = {};
    $("#interval").val("");
    $("#intervalList").find('option').remove();
    intervalList.reload();
    $("#intervalCount").text($('#intervalList option').length);
    $('#attrTreeSelect').find('option').remove();
    treeAttributes.reload();
    treeOnChange();
    $("a#dwnJSONAnnotations").attr("href","");
    $("#theVideo video").remove();
    // $("#theVideo").html("<video style='width:100%;' controls=''></video>");
    // $video = $("#theVideo video");
    regions = [];
    annObjLen = 0;
    zerotime = 0;

    // be sure to show the results
    $("#result_block").removeClass("hidden").addClass("show");

    // Closure to capture the file information.
    var appCounter = 0;
    // populate the AttributeList
    function handleFile(f) {
      var $title = $("<strong>", {
        text: f.name
      });
      var $fileContent = $("<ul>");
      sessionName = f.name;
      $result.append($title);
      $result.append($fileContent);


      var dateBefore = new Date();
      JSZip.loadAsync(f).then(function (zip) {
        attrDict = {};
        var dateAfter = new Date();
        $title.append($("</strong><span>", {
          "class": "small",
          text: " (loaded in " + (dateAfter - dateBefore) + "ms)"
        }));

        zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
          $fileContent.append($("<li>", {
            text: zipEntry.name
          }));

          // Load the .mp4 file into the player
          // if (zipEntry.name.includes(".mp4")) {
          // 	zipEntry.async("blob").then(function (content) {
          // 		var binaryVideo = [];
          // 		binaryVideo.push(content);
          // 		var source = document.createElement('source');
          // 	    source.src = window.URL.createObjectURL(new Blob(binaryVideo));
          // 	    source.type = "video/mp4";
          // 	    $video.append(source);
          // 	});
          // }

          // Load the .JSON file into the plot
          if (zipEntry.name.includes(".json")) {
            zipEntry.async("text").then(function (content) {
              appCounter = appCounter + 1;
              addToAttrDict(content);
              treeAttributes.reload();
            });
          }

        });
      }, function (e) {
        $result.append($("<div>", {
          "class": "alert alert-danger",
          text: "Error reading " + f.name + ": " + e.message
        }));
      });
    }
    var files = evt.target.files;
    for (var i = 0; i < files.length; i++) {
      handleFile(files[i]);
    }
  });

  function addToAttrDict (json_flat) {
    json_object = JSON.parse(json_flat);
    var applicationName = json_object.getProp("applicationName");
    var recordingID = json_object.getProp("recordingID");
    var attr;
    var parts;
    var data_section = "";
    tempAttrDict = {}
    if (json_object.getProp("frames")) {
      for (i in json_object.getProp("frames")) {
        if (json_object.getProp("frames")[i]){
          for (j in json_object.getProp("frames")[i].getProp("frameAttributes")) {
            if (!(j in tempAttrDict)) {
              tempAttrDict[j] = {};
            }
            tempAttrDict[j][json_object.getProp("frames")[i].getProp("frameStamp").substring(0,12)] = json_object.getProp("frames")[i].getProp("frameAttributes")[j];
          }
        }
      }
    } else if (json_object.getProp("intervals")) {
      jObjInt = json_object.getProp("intervals");
      for (el in jObjInt){
        jObjInt[el].class = 'rated';
        jObjInt[el].axis = 'x';
        if (jObjInt[el].hasOwnProperty('start') && jObjInt[el].hasOwnProperty('end')){

          begin = (parseFloat(moment.duration(jObjInt[el].start.substring(0,12)).asSeconds())).toFixed(2).toString();
          jObjInt[el].start = begin;
          stop = (parseFloat(moment.duration(jObjInt[el].end.substring(0,12)).asSeconds())).toFixed(2).toString();
          jObjInt[el].end = stop;
          $("#intervalList").append("<option value='"+begin+", "+stop+"' data-section='saved internally'>"+ moment.duration(parseFloat(begin), 'seconds').format("hh:mm:ss.SSS")+" to "+moment.duration(parseFloat(stop), 'seconds').format("hh:mm:ss.SSS")+"</option>");
        }
        if (jObjInt[el].hasOwnProperty('annotations')){
          keys = Object.keys(jObjInt[el].annotations);
          for (k in keys){
            if (keys[k]!='axis' && keys[k]!='start' && keys[k]!='end' && keys[k]!='class'){
              if ($("input[name=inputKeyList][value="+keys[k]+"]").length==0){
                $("#keyValuePairList").append('<div class="keyValuePair"><label>'+keys[k]+'</label><input type="hidden" name="inputKeyList" value="'+keys[k]+'" /><input type="text" class="form-control input-sm smallInput" name="inputValueList" placeholder="Add value"/> <div class="deleteKeyValueLink small"><a href="#" class="deleteKeyValuePair">[X]</a></div></div> ');
              }
              jObjInt[el][keys[k]] = jObjInt[el].annotations[keys[k]];
            }
          }
          delete jObjInt[el].annotations;
        }
      }
      intervalList.reload();
      $("#intervalCount").text($('#intervalList option').length);
      regions = jObjInt;
      chart.regions(regions);

    }

    for (i in Object.keys(tempAttrDict)){
      //console.log(Object.keys(tempAttrDict)[i]+" "+sum(tempAttrDict[Object.keys(tempAttrDict)[i]]));
      data_section = applicationName;
      attr = Object.keys(tempAttrDict)[i];
      if ($("#attrTreeSelect option[value='"+attr+"']").length <= 0){ // check if it first exists
        if ((sum(tempAttrDict[attr])!=0 && !isNaN(sum(tempAttrDict[attr]))) || stringObj(tempAttrDict[attr])){
          parts = attr.split("_");
          if (parts.length>1) {
            for (p=0; p<parts.length-1; p++) data_section += "/"+ parts[p];
          }
          html = "<option value='"+attr+"' data-section='"+data_section+"'>"+parts[parts.length-1]+"</option>";
          $("#attrTreeSelect").append(html);
        }

      }
    }
    attrDict = Object.assign(attrDict, tempAttrDict);

    // Determine max time-length (max key for each attribute in the attrDict)
    for (i in attrDict){
      if (getMax(attrDict[i])> annObjLen){
        annObjLen = getMax(attrDict[i]);
      }
    }

    // in case this Application contains 'GPS' means it is a map
    if( applicationName.indexOf('GPS') >= 0 || applicationName.indexOf('gps') >= 0){
      mapIsActive = true;
      replaceVideoWithMap(tempAttrDict,recordingID);
    }

  }


  function replaceVideoWithMap(dict,recordingID){
    // Convert MLT-JSON into GeoJSON
    keyLat = Object.keys(dict)[1];
    keyLon = Object.keys(dict)[0];
    times = Object.keys(dict[keyLat]);
    times = times.map(s => moment(recordingID,'YYYY-MM-DD[T]HH-mm-ss[.]SSS').add(moment.duration(s)).toISOString());
    zerotime = moment(recordingID,'YYYY-MM-DD[T]HH-mm-ss[.]SSS');
    properties = {"name":recordingID,"times":times}
    latitudes = Object.values(dict[keyLat]);
    longitudes = Object.values(dict[keyLon]);
    coordinates = zip(latitudes,longitudes);
    geometry = {"type":"LineString","coordinates":coordinates}
    geoJSONObj = {"type":"Feature","properties":properties,"geometry":geometry}

    // Replace the video file with LeafLet map
    $("#theVideo").html('<div class="panel panel-default"><div class="panel-heading panel-footer"><h3 class="panel-title ">Map</h3></div><div class="panel-body" id="theMap"></div></div>');
    $("#theMap").css({'height':'400px'});
    mymap = L.map('theMap',{
      zoom: 15,
      center: [longitudes[0], latitudes[0]],
      timeDimension: true,
      timeDimensionOptions: {
        timeInterval: times[0]+"/"+times[times.length - 1],
        period: "PT1S"
      },
      timeDimensionControl: true,
      timeDimensionControlOptions :{timeZones: ["Local"]}
    });
    // Add metadata of Leaflet
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGltc3R1ZGlvIiwiYSI6ImNrN2xyaThwNDAydXYzbHAzbHMyajZlZTUifQ.favWAVYnUbCg7W5UJL8I1A', {
        attribution: 'Map data',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,

        accessToken: 'pk.eyJ1IjoiZGltc3R1ZGlvIiwiYSI6ImNrN2xyaThwNDAydXYzbHAzbHMyajZlZTUifQ.favWAVYnUbCg7W5UJL8I1A'
      }).addTo(mymap);
    // Add coordinates
    addGeoJSONLayer(mymap, geoJSONObj);
    mymap
  }


  function addGeoJSONLayer(map, data) {
    var icon = L.icon({
      iconUrl: 'images/marker.png',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    var geoJSONLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latLng) {
        if (feature.properties.hasOwnProperty('last')) {
          return new L.Marker(latLng, {
            icon: icon
          });
        }
        return L.circleMarker(latLng);
      }
    });

    var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
      updateTimeDimension: true,
      duration: 'PT2M',
      updateTimeDimensionMode: 'replace',
      addlastPoint: true
    });

    geoJSONLayer.addTo(map);
    geoJSONTDLayer.addTo(map);
    // Fit the bounds of the map to the itinerary
    map.fitBounds(geoJSONLayer.getBounds());
    // Update the marker
    map.timeDimension.on('timeload', function(data) {
      //console.log((data.time-zerotime)/1000);
      chart.xgrids([{
        value: (data.time-zerotime)/1000,
        class: 'currentTime'
      }]);
    });
  }




  function treeOnChange(allSelectedItems, addedItems, removedItems) {
    var xs = {};
    var columns = [];
    var keyMax = 0;
    var normalize = $("#attrNormalize").is(':checked');
    var attr;
    var arr;
    var xMax;
    var xMin;
    for (let i in allSelectedItems){
      attr = allSelectedItems[i].value;
      if (sum(attrDict[attr])!=0 && !isNaN(sum(attrDict[attr]))){
        var cols = [];
        if (normalize){
          arr = Object.keys(attrDict[attr]).map(function (k) { return attrDict[attr][k]; });
          xMin = Math.min.apply( null, arr );
          xMax = Math.max.apply( null, arr );
          $.each( attrDict[attr], function( key, value ) {cols.push((2*(value - xMin)/ (xMax - xMin))-1);});
          //cols = $.map(attrDict[attr], function (value, key) { return (2*(value - xMin)/ (xMax - xMin))-1 });
        } else {
          $.each( attrDict[attr], function( key, value ) {cols.push(value);});
          //cols = $.map(attrDict[attr], function (value, key) { return value });
        }
        cols.unshift(attr);
        attrDict[attr];
        var rows = [];
        $.each( attrDict[attr], function( key, value ) {rows.push(moment.duration(key).asSeconds());});
        //rows = $.map(attrDict[attr], function (value, key) { return moment.duration(key).asSeconds()});
        max = moment.duration(Object.keys(attrDict[attr])[Object.keys(attrDict[attr]).length - 1]).asSeconds()
        if (max > keyMax) {
          keyMax = max;
        }
        rows.unshift(attr + '_x');
        columns.push(cols);
        columns.push(rows);
        xs[attr] = attr + '_x';
      } else if (stringObj(attrDict[attr])) {
        // String time series (e.g. feedback)
        rows = $.map(attrDict[attr], function (value, key) { return moment.duration(key).asSeconds()});
        rows.unshift(attr + '_x');
        values = $.map(attrDict[attr], function (value, key) { return "0" });
        values.unshift(attr);
        columns.push(values);
        columns.push(rows);
        xs[attr] = attr + '_x';
      }
    }
    var xAxisTicks = [];
    if (keyMax > 0) {
      q = keyMax / 20;
      for (i = 0; i <= 20; i =i+1) {
        xAxisTicks.push(toInteger(q*(i+1)));
      }

    }
    generatePlot(xs,columns,xAxisTicks);
  }

// generatePlot (out of the AttributeList)
  function generatePlot(xs,columns,xAxisTicks) {
    chart = c3.generate({
      bindto: '#plotGraph',
      data: {
        xs: xs,
        xFormat: '%S.%L',//'%H:%M:%S.%L'	,
        columns: columns,
        onclick: function (id) {
          if(window._AnimationToolInstance) {
            window._AnimationToolInstance.updateFrameIdx(id.index);
          }
          if(videoIsActive){
            $("#theVideo video")[0].currentTime=id.x;
          }
          if(mapIsActive){
            mymap.timeDimension.setCurrentTime(zerotime+(id.x*1000));
          }
        }
      },
      subchart: {
        show: true,
        onbrush: function (domain) {
          $('#interval').val(domain[0].toFixed(3) + ', ' + domain[1].toFixed(3));
        }
      },
      legend: {
        show: false
      },
      grid: {
        x: {show: true},
        y: {show: true}
      },
      zoom: {
        enabled: false,
        rescale: true,
        onzoom: function (domain) {
          $('#interval').val(domain[0].toFixed(3) + ', ' + domain[1].toFixed(3));
        }
      },
      axis: {
        x: {
          //type: 'timeseries',
          tick: {
            format: function(x) {
              return moment.duration(x, 'seconds').format("hh:mm:ss");
            },
            values: xAxisTicks
          },
          label: "Time (s)"
        },
        y: {
          tick: {
            format: d3.format('.2f')
          }
        }
      },
      size: {
        height: 500
      },
      padding:{
        top:20
      },
      tooltip: {
        grouped: false,
        format: {
          title: function (d) { return  moment.duration(d, 'seconds').format("hh:mm:ss.SSS"); },
          value: function (value, ratio, id, index) {
            return attrDict[id][Object.keys(attrDict[id])[index]];
          }
        }
      }

    });
    chart.regions(regions);

    $("#theVideo video").on("timeupdate",
      function (event) {
        chart.xgrids([{
          value: this.currentTime,
          class: 'currentTime'
        }]);
      });
    if ($.isEmptyObject(xs)){
      $("#plotGraph").addClass('howTo');
    } else {
      $("#plotGraph").removeClass('howTo');
    }

  }//end generate plot


// ATTRIBUTE LIST
  var treeAttributes = $("#attrTreeSelect").treeMultiselect({
    allowBatchSelection: true,
    onChange: treeOnChange,
    startCollapsed: true,
    hideSidePanel: true,
    //searchable: true
  })[0];

  var intervalList = $("#intervalList").treeMultiselect({
    allowBatchSelection: true,
    onChange: intervalsOnChange,
    startCollapsed: false,
    hideSidePanel: true,
    //searchable: true
  })[0];


  $("#addinterval").unbind().click(function () {
    if ($("#interval").val()){
      var arr = $("#interval").val().split(", "),
        begin = arr[0], stop = arr[1];
      regions.push({ axis: 'x', start: begin, end: stop, class: 'rated' });
      $("#intervalList").append("<option value='"+begin+", "+stop+"' data-section='added manually'>"+ moment.duration(parseFloat(begin), 'seconds').format("hh:mm:ss.SSS")+" to "+moment.duration(parseFloat(stop), 'seconds').format("hh:mm:ss.SSS")+"</option>");
      intervalList.reload();
      $("#intervalCount").text($('#intervalList option').length);
      chart.regions(regions);
    }
  });

  $("#delete-button").click(function(){
    if(confirm("Are you sure you want to delete all the selected intervals?")){
      var values = $("#intervalList option:selected").map(function() { return $(this).val(); });
      for (i in values){
        if(values[i].length>5){
          for (k in regions){
            if (regions[k].start == values[i].split(', ')[0] && regions[k].end == values[i].split(', ')[1]){
              regions.splice(k,1);
            }
          }
        }
      }
      chart.regions(regions);
      $("#intervalList option:selected").remove();
      intervalList.reload();
      $("#intervalCount").text($('#intervalList option').length);
    }
    else{
      return false;
    }
  });

  function intervalsOnChange(allSelectedItems, addedItems, removedItems) {
    var keys = [];
    var inter;
    var temp = {};
    $("input[name=inputKeyList]").each(function() { keys.push($(this).val()); });
    $("input[name=inputValueList]").val('').attr('placeholder','Add value');
    for (k in regions){
      regions[k].class = "rated";
    }
    for (i in allSelectedItems){
      inter = allSelectedItems[i].value;
      for (k in regions){
        if (regions[k].start == inter.split(', ')[0] && regions[k].end == inter.split(', ')[1]){
          regions[k].class = "selected";
          for (j in keys){
            if (regions[k].hasOwnProperty(keys[j])) {
              if (!temp.hasOwnProperty(keys[j])) temp[keys[j]] = regions[k][keys[j]];
              if (regions[k][keys[j]] == temp[keys[j]]){
                $("input[name=inputKeyList][value="+keys[j]+"]").next().val(temp[keys[j]]);
                temp[keys[j]] = regions[k][keys[j]];
              } else {
                $("input[name=inputKeyList][value="+keys[j]+"]").next().val('').attr('placeholder','?');
                temp[keys[j]] = '';
              }
            } else if (temp.hasOwnProperty(keys[j])){
              $("input[name=inputKeyList][value="+keys[j]+"]").next().val('').attr('placeholder','?');
              temp[keys[j]] = '';
            }

          }

        }
      }
    }
    chart.regions(regions);
  }


  $("#addAnnotationKey").unbind().click(function () {
    var key = $("#inputKey").val();
    if (key && key!='axis' && key!='start' && key!='end' && key!='class') {
      if ($("input[name=inputKeyList][value="+key+"]").length>0){
        alert('Key already exists in the annotation list.');
      }
      else {
        $("#keyValuePairList").append('<div class="keyValuePair"><label>'+key+'</label><input type="hidden" name="inputKeyList" value="'+key+'" /><input type="text" class="form-control input-sm smallInput" name="inputValueList" placeholder="Add value"/> <div class="deleteKeyValueLink small"><a href="#" class="deleteKeyValuePair">[X]</a></div></div>');
        $("#inputKey").val('').removeAttr('value');
        $("#inputDefaultValue").val('').removeAttr('value');
      }

    } else {
      alert('Key invalid. Forbidden key names are start, end, class, axis.')
    }

    $("a.deleteKeyValuePair").unbind().on('click', function (e) {
      e.preventDefault();
      if(confirm("Are you sure you want to delete this annotation pair?")){
        $(this).parent('div').parent('div').hide().remove();
      }
    });
  });

  $("#keyValuePairForm").on("change", function (evt) {
    var inputKeys = [];
    var inputValues = [];
    var annotationList;
    var inter;

    $("input[name='inputKeyList']").each(function() { inputKeys.push($(this).val()); });
    $("input[name='inputValueList']").each(function() {
      if ($(this).val()=="" && $(this).attr("placeholder")=="?") {
        inputValues.push(null);
      } else {
        inputValues.push($(this).val());
      }
    });
    if (inputKeys.length>0 && inputValues.length>0){
      annotationList = toObject(inputKeys,inputValues);
    }
    var interv = $('select#intervalList').val();
    for (i in interv){
      inter = interv[i];
      for (k in regions){
        if (regions[k].start == inter.split(', ')[0] && regions[k].end == inter.split(', ')[1]){
          for (j in annotationList){
            if (annotationList[j]!=null) regions[k][j] = annotationList[j];
          }
        }
      }
    }
  });

  $("#exportJSON").unbind().click(function () {
    var annotationList = [];
    var jsObjRegions = [];
    var jsonObj = {};

    $("input[name='inputKeyList']").each(function() { annotationList.push($(this).val()); });
    if (annotationList.length>0){
      // Regions -> annotations.json
      for(r in regions) {
        var reg = {};
        for (k in regions[r]){
          if (k=='start' || k=='end'){
            reg[k]= moment(moment.duration(parseFloat(regions[r][k]), 'seconds')._data).format('HH:mm:ss.SSS');
          } else if(k != 'axis' && k != 'class') {
            if (!reg.hasOwnProperty('annotations')) reg.annotations = {};
            reg.annotations[k] = regions[r][k];
          }
        }
        jsObjRegions.push(reg);
      }
      jsonObj.setProp("applicationName", "ManualAnnotations");
      jsonObj.setProp("recordingID", sessionName.replace('.zip',''));
      jsonObj.setProp("intervals",  jsObjRegions);
      jsonObj = JSON.stringify(jsonObj, 0, 4);

      if ($("#sessionFile").length>0){
        var $file = $("#sessionFile")[0].files[0];
        var zip = new JSZip();
        zip.loadAsync($file).then(function (zip) {
          zip.file(sessionName.replace('.zip','')+"annotations.json", jsonObj);
          var newZip = zip.generateAsync({type:"blob",compression: "DEFLATE"}).then(function callback(blob) {
            //saveAs(blob, SessionsionName.replace('.zip','_annotated.zip'));
            $("a#dwnZIPannotations").attr("href",URL.createObjectURL(blob)).attr("download",sessionName.replace('.zip','_annotated.zip'));
          }, function (e) {
            showError(e);
          });
        });
      }
      $("a#dwnJSONAnnotations").attr("href","data:text/json;charset=utf-8," + encodeURIComponent(jsonObj)).attr("download",sessionName.replace('.zip','annotations.json'));
      $("#inputGroupAnnotations").show();

      $("#plotJSON").unbind().click(function () {
        addToAttrDict(jsonObj);
        treeAttributes.reload();
      });
    }

  });


// Event handler - Load Annotation Panel
  $("#annotationFile, #offset").on("change", function (evt) {
    var fileExtension = ['json'];
    var jsObjRegions = [];
    var reg = {};
    var inputKeys = [];
    var offset = 0;
    if ($.inArray($("#annotationFile").val().split('.').pop().toLowerCase(), fileExtension) == -1) {
      alert("Only formats are allowed : "+fileExtension.join(', '));
    } else {
      var fileLength = $("#annotationFile")[0].files.length;
      if(fileLength === 0){
        alert("Annotation file is empty!");
      } else {
        if (typeof chart != "undefined"){
          $("input[name=inputKeyList]").each(function() { inputKeys.push($(this).val()); });
          if (regions.length>0 || inputKeys.length>0 ){
            if(confirm("Changing these values will delete current annotations. Continue?")){
              $("#keyValuePairList").empty();
              $("#interval").val("");
              $("#intervalCount").text($('#intervalList option').length);
              $("#intervalList").find('option').remove();
            }

          }

          f = $("#annotationFile").prop('files')[0];
          var r = new FileReader();
          r.onload = function(e) {

            jObj = JSON.parse(e.target.result);
            jObjInt = jObj.intervals;
            if ($("#offset").val()!='') offset = parseFloat($("#offset").val());
            for (el in jObjInt){
              jObjInt[el].class = 'rated';
              jObjInt[el].axis = 'x';
              if (jObjInt[el].hasOwnProperty('start') && jObjInt[el].hasOwnProperty('end')){
                begin = (parseFloat(moment.duration(jObjInt[el].start.substring(0,12)).asSeconds())+ offset).toFixed(2).toString();
                jObjInt[el].start = begin;
                stop = (parseFloat(moment.duration(jObjInt[el].end.substring(0,12)).asSeconds())+ offset).toFixed(2).toString();
                jObjInt[el].end = stop;
                $("#intervalList").append("<option value='"+begin+", "+stop+"' data-section='external file'>"+ moment.duration(parseFloat(begin), 'seconds').format("hh:mm:ss.SSS")+" to "+moment.duration(parseFloat(stop), 'seconds').format("hh:mm:ss.SSS")+"</option>");
                $("#intervalCount").text($('#intervalList option').length);
              }
              if (jObjInt[el].hasOwnProperty('annotations')){
                keys = Object.keys(jObjInt[el].annotations);
                for (k in keys){
                  if (keys[k]!='axis' && keys[k]!='start' && keys[k]!='end' && keys[k]!='class'){
                    if ($("input[name=inputKeyList][value="+keys[k]+"]").length==0){
                      $("#keyValuePairList").append('<div class="keyValuePair"><label>'+keys[k]+'</label><input type="hidden" name="inputKeyList" value="'+keys[k]+'" /><input type="text" class="form-control input-sm smallInput" name="inputValueList" placeholder="Add value"/> <div class="deleteKeyValueLink small"><a href="#" class="deleteKeyValuePair">[X]</a></div></div> ');
                    }
                    jObjInt[el][keys[k]] = jObjInt[el].annotations[keys[k]];
                  }
                }
                delete jObjInt[el].annotations;
              }

            }
            intervalList.reload();
            $("#intervalCount").text($('#intervalList option').length);
            regions = jObjInt;
            chart.regions(regions);

            $("a.deleteKeyValuePair").unbind().on('click', function (e) {
              e.preventDefault();
              if(confirm("Are you sure you want to delete this annotation pair?")){
                $(this).parent('div').parent('div').hide().remove();
                var property = $(this).parent('div').parent('div').children('input[name=inputKeyList]').val();
                jsObjRegions = [];
                for(r in regions) {
                  reg = {};
                  for (k in regions[r]){
                    if(k != property) {
                      reg[k] = regions[r][k];
                    }
                  }
                  jsObjRegions.push(reg);
                }
                regions = jsObjRegions;
                chart.regions(regions);
              }
            });
          }
          r.readAsText(f);
        } else {
          alert("Session is not loaded. Load a session first!");
        }

      }
    }


  });
// Test if the field (offset) is a float
  $(".number").keypress(function(e){
    if (e.which != 46 && e.which != 45 && e.which != 46 &&
      !(e.which >= 48 && e.which <= 57)) {
      return false;
    }
  });

// Sums the values of a dictionary
  function sum( obj ) {
    var sum = 0;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseFloat( obj[el] );
      }
    }
    return sum;
  }

// Check if the values of a dictionary ares strings
  function stringObj( obj ) {
    var sum = 0;
    var result = false;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        if (obj[el] != null) {
          sum += obj[el].length;
        }
      }
    }
    if (sum > Object.keys(obj).length)
      result = true;
    return result;
  }

// Get the max key of a dicotionary
  function getMax(obj) {
    return Math.max.apply(null,(Object.keys(obj).forEach(toDurationS)));
  }

// merge 2 lists into dictionary
  function toObject(names, values) {
    var result = {};
    for (var i = 0; i < names.length; i++)
      result[names[i]] = values[i];
    return result;
  }

  function toDurationS(time){
    var result = 0;
    var spl = time.split(':');
    if (spl.length == 3) {
      result =  parseFloat(spl[2]) + parseFloat(spl[1]) * 60 + parseFloat(spl[0]) * 3600;
    }
    else {
      console.log("Invalid time format in toDurationS ")
    }
    return result;
  }

  function toInteger(number){
    return Math.round(  // round to nearest integer
      Number(number)    // type cast your input
    );
  }

  window.onbeforeunload = function (e) {
    var message = "Do you want to leave the page?",
      e = e || window.event;
    // For IE and Firefox
    if (e) {
      e.returnValue = message;
    }

    // For Safari
    return message;
  };

// zipping two lists together
  function zip() {
    var args = [].slice.call(arguments);
    var shortest = args.length==0 ? [] : args.reduce(function(a,b){
      return a.length<b.length ? a : b
    });

    return shortest.map(function(_,i){
      return args.map(function(array){return array[i]})
    });
  }

// Case unsensentive setters and getters
//https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively
  Object.defineProperty(Object.prototype, "getProp", {
    value: function (prop) {
      var key,self = this;
      for (key in self) {
        if (key.toLowerCase() == prop.toLowerCase()) {
          return self[key];
        }
      }
    },
    //this keeps jquery happy
    enumerable: false
  });


  Object.defineProperty(Object.prototype, "setProp", {
    value: function (prop, val) {
      var key,self = this;
      var found = false;
      if (Object.keys(self).length > 0) {
        for (key in self) {
          if (key.toLowerCase() == prop.toLowerCase()) {
            //set existing property
            found = true;
            self[key] = val;
            break;
          }
        }
      }

      if (!found) {
        //if the property was not found, create it
        self[prop] = val;
      }

      return val;
    },
    //this keeps jquery happy
    enumerable: false
  });
};
