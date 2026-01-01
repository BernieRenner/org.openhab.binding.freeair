(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.freeAir = {}));
})(this, (function (exports) { 'use strict';

    var log_array$1 = [
        {
            name        : "daily",
            sec_type    : 2,
            classletter : "T",
            tab_place   : 12,
            place_1     : 4,
            place_2     : 5,
            place_3     : 6,
            place_4     : 7, 
            id_name     : "TV_",
            aircoef     : 3.556,
            Tcoef       : 1,
            enecoef     : 42.7,
            watercoef   : 128,
            DLmax       : 24,
            opho        : 24,
            id_tab      : "nav5"
        },
        {
            name        : "monthly",
            sec_type    : 3,
            classletter : "M",
            tab_place   : 13,
            place_1     : 8,
            place_2     : 9,
            place_3     : 10,
            place_4     : 11,
            id_name     : "MV_",
            aircoef     : 113.8,
            Tcoef       : 24,
            enecoef     : 1365,
            watercoef   : 4096,
            DLmax       : 720,
            opho        : 720,
            id_tab      : "nav6"

        }
    ];

    var blobsArray = {
        Daily: [],
        Monthly: [],
    };

    var langs = [
        {
            name                 : "de",
            lang_nr              : 1,
            showPwd              : "<a onclick='showPwd()'>Passwort anzeigen</a>",
            hidePwd              : "<a onclick='hidePwd()'>Passwort verstecken</a>",
            cl_popover_content   : "Bitte geben Sie die Seriennummer Ihres Ger&auml;tes ein.",
            id_flag              : "flag_de",
            flag_file_name       : "de.png",
            column_nr            : 2,
            no                   : "nein",
            yes                  : "ja",
            prg_water_ins_short  : "wet",
            prg_cooling_short    : "kuh",
            prg_co2_short        : "co2",
            prg_min_vent_short   : "mnl",
            prg_hr_rel_short     : "efr",
            prg_hr_abs_short     : "efa",
            prg_hum_ins_short    : "fet",
            prg_out_temp_short   : "alu",
            om_hum_red_long      : "Entfeuchtung",
            om_hum_red_short     : "hrd",  //TODO
            key_edit_placeholder : "fAPasswort",
            button_pwd_placeholder: "fAPasswort"
            
        },
        {
            name                 : "en",
            lang_nr              : 2,
            showPwd              : "<a onclick='showPwd()'>Show password</a>",
            hidePwd              : "<a onclick='hidePwd()'>Hide password</a>",
            cl_popover_content   : "Please enter the serial number of your device.",
            id_flag              : "flag_en",
            flag_file_name       : "eng.png",
            column_nr            : 1,
            no                   : "no",
            yes                  : "yes",
            prg_water_ins_short  : "win",
            prg_cooling_short    : "col",
            prg_co2_short        : "co2",
            prg_min_vent_short   : "mve",
            prg_hr_rel_short     : "hrr",
            prg_hr_abs_short     : "hra",
            prg_hum_ins_short    : "hin",
            prg_out_temp_short   : "otb",
            om_hum_red_long      : "Hum.Reduction",
            om_hum_red_short     : "hrd",
            key_edit_placeholder : "Key",
            button_pwd_placeholder: "Key"
        }
    ];


    var $secLogHeader$1 =
    [
        ['TIM',''],
        ['RES',''],
        ['TET','[°C]'],
        ['HET','[%]'],
        ['TOU','[°C]'],
        ['HOU','[%]'],
        ['CO2','[ppm]'],
        ['TSU','[°C]'],
        ['TEH','[°C]'],
        ['APR','[hPa]'],
        ['ADY','[kg/m3]'],
        ['HRP','[%]'],
        ['SNR',''],
        ['DL1','[S:M]'],
        ['DL2','[S:M]'],
        ['DL3','[S:M]'],
        ['DL4','[S:M]'],
        ['DL5','[S:M]'],
        ['DSM','[S:M]'],
        ['DTM','[S:M]'],
        ['D1R','[S:M]'],
        ['DDF','[S:M]'],
        ['DMV','[S:M]'],
        ['DWI','[S:M]'],
        ['DHI','[S:M]'],
        ['DRA','[S:M]'],
        ['DRR','[S:M]'],
        ['DCO','[S:M]'],
        ['DC2','[S:M]'],
        ['HRU',''],
        ['HRN',''],
        ['EXE','[Wh]'],
        ['REE','[Wh]'],
        ['PCO','[Wh]'],
        ['COE','[Wh]'],
        ['AEX','[m3]'],
        ['WAR','[g]'],
        ['ES' ,''],
        ['EFN',''],
        ['ELN',''],
        ['ECO',''],
        ['FSF',''],
        ['FEF',''],
    	['SWV',''],
        ['S21',''],
        ['S22',''],
        ['S23',''],
        ['S24',''],
        ['S25',''],
        ['S26',''],
        ['S27',''],
        ['S28',''],
        ['S29',''],
        ['S30', '']
    ];


    var $diagramList =
    [
        ['TET', 1, "#f3e500"], // remain
        ['HET', 2, "#FF7733"], // orange
        ['TOU', 1, "#01db8b"], // navy blue
        ['HOU', 2, "#672011"], 
        ['CO2', 3, "#000080"], 
        ['TSU', 1, "#f3e500"],
        ['TEH', 1, "#dfab62"], 
        ['APR', 4, "#ef5253"], // red
        ['ADY', 5, "#FF33F9"], // violet
        ['HRP', 2, "#FF3371"], 
        ['EXE', 6, "#177612"], // dark green
        ['REE', 6, "#3CFF33"],
        ['PCO', 6, "#AFFF33"], 
        ['COE', 6, "#900db0"], // violet 
        ['AEX', 7, "#FF33D4"], // rosa
        ['WAR', 8, "#33FFFF"] 
    ];

    var mapUnits = 
    [
        [0, ''          , ''        , 10000 , 10000 ],
        [1, '[°C]'      , '°C'      , -50   , 100   ],
        [2, '[%]'       , '%'       , 0     , 100   ],
        [3, '[ppm]'     , 'ppm'     , 300   , 5000  ],
        [4, '[hPa]'     , 'hPa'     , 10000 , 10000 ],
        [5, '[kg/m3]'   , 'kg/m3'   , 10000 , 10000 ],
        [6, '[Wh]'      , 'Wh'      , 10000 , 10000 ],
        [7, '[m3]'      , 'm3'      , 10000 , 10000 ],
        [8, '[g]'       , 'g'       , 10000 , 10000 ]
    ];


    var $chosenUnits$1 = [];

    const DEFAULT_LANG_NAME   = "en";
    const MAGIC_WORD_TRANSLATION = "rrrsssttt";

    const HIDE$1 = 1;
    const SHOW$1 = 2;


    const PRIM_LOG_PLACE_1 = 0;
    const PRIM_LOG_PLACE_2 = 1;
    const PRIM_LOG_PLACE_3 = 2;
    const PRIM_LOG_PLACE_4 = 3;


    const PLAUSI_TEMP_MAX$1 =  100;
    const PLAUSI_TEMP_MIN$1 =  -50;
    const PLAUSI_HUM_MAX$1  =  100;
    const PLAUSI_HUM_MIN$1  =    0;
    const PLAUSI_AIR_MAX$1  =  150;
    const PLAUSI_AIR_MIN$1  =    0;
    const PLAUSI_WRP_MAX$1  =  110;
    const PLAUSI_WRP_MIN$1  =    0;
    const PLAUSI_CO2_MAX  = 6000;
    const PLAUSI_CO2_MIN  =    0;

    const SRN_RELOAD      = 10;

    const TRANS_SECLOG    = 2;


    const DG_DAYS_30$1            = 1;
    const DG_DAYS_100$1           = 2;
    const DG_MONTHS$1             = 3;
    const DG_DAYS_AND_MONTHS    = 4;



    // create object line chart data, must be global
    var lineChartData = {};

    class Api {
        static getTranslation(lang) {
            return Api.getData('/api/language.php', new URLSearchParams({ lang }));
        }
        static postButton(data) {
            return Api.postData('/api/button.php', data);
        }
        static getValues(serialnumber) {
            return Api.getData('/api/values.php', new URLSearchParams({ serialnumber: serialnumber.toString() }));
        }
        static async getData(url, data) {
            try {
                const response = await fetch(url + (data ? "?" + data.toString() : ""));
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const json = await response.json();
                return json;
            }
            catch (error) {
                console.error(error.message);
                throw error;
            }
        }
        static async postData(url, data) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: data,
                });
                return response;
                // for now no exception handling as the postButton is doing it itself.
            }
            catch (error) {
                console.error(error.message);
                throw error;
            }
        }
    }

    // TODO: remove jquery
    function changeDiagInput()
    {
        $( '#popupDiagInput' ).show();
    }

    function changeLogType()
    {
        $( '#popupDiagLogType' ).show();
    }

    function buttonDiagInputHide()
    {
        $( '#popupDiagInput' ).hide();
    }

    function buttonDiagLogTypeHide()
    {
        $( '#popupDiagLogType' ).hide();
    }

    /**
     * prepare the information which units should be checked in the diagra
     * input (only variables
     * of two units are possibl
     */
    function checkForUnitCompatibility()
    {
        // get the already marked units
        var $arMarkedUnits = [];
        for (var $i = 0; $i < $diagramList.length; $i++)
        {  
            if ($("#DG_" + $diagramList[$i][0]).is(":checked"))
            { 
                var $bIsThere = false;
                // check, whether this unit already in the unit array
                for (var $j = 0; $j < $arMarkedUnits.length; $j++)
                {
                    // check whether we have already seen this unit in
                    // the list of checked so we can enable it
                    if ($diagramList[$i][1] == $arMarkedUnits[$j])
                    {
                        $bIsThere = true;
                    }
                } 
                if (!$bIsThere)
                {
                    /*the unit is not in the list yet, so add it to the marked
                    list (actually it it not possible to get more than three units,
                    as it is checked every click)*/
                    $arMarkedUnits[$arMarkedUnits.length] = $diagramList[$i][1];
                }  
                if ($arMarkedUnits.length >= 2)
                {
                    // we already have two units, so we don't need to look further
                    doTheWork($arMarkedUnits);
                    return;
                } 
            }  
        }
        // we have already checked everything, so do the work of checking now
        doTheWork($arMarkedUnits);
        return; 
    }


    /**
     * if already 2 marked, get them and enable, resp. disable the units;
     * if < 2 units marked, enable all units
     * @param {} $arUnits 
     */
    //TODO Plausi cannot be > 2...
    function doTheWork($arUnits)
    {
        if ($arUnits.length >= 2)
        {
            for (var $i = 0; $i < $diagramList.length; $i++)
            {
                var $bEnable = false;
                for (var $j = 0; $j < $arUnits.length; $j++)
                {
                    if ($diagramList[$i][1] == $arUnits[$j])
                    {
                        $bEnable = true;
                    }
                }
                if ($bEnable)
                {
                    $("#DG_" + $diagramList[$i][0]).removeAttr("disabled");
                }
                else
                {
                    $("#DG_" + $diagramList[$i][0]).attr("disabled", true);
                }
            }
        }
        else
        {
            for (var $i = 0; $i < $diagramList.length; $i++)
            {
                $("#DG_" + $diagramList[$i][0]).removeAttr("disabled");
            }
        }
        // save the marked units  
    }

    function submitDiagInput()
    {
        document.getElementById('popupDiagInput').style.display = "none";
        chjs(true);
        myOnLoad(true);
    }

    function chjs($reload)
    {
        // get information which variables are to be displayed
        var $arrVariables = [];

        let lang = localStorage.getItem("language") ?? "en";

        // empty chosen units if we are reloading, so we can change the units if needed
        if ($reload)
        {
            $chosenUnits = [];
        }

        for (var $i = 0; $i < $diagramList.length; $i++)
        {
            var $bIsThere = false;
            
            if ($("#DG_" + $diagramList[$i][0]).is(":checked"))
            {
                $arrVariables.push($diagramList[$i][0]);
            
                for (var $j = 0; $j < $chosenUnits.length; $j++)
                {
                    if ($diagramList[$i][1] == $chosenUnits[$j])
                    {
                        $bIsThere = true;
                    }
                } 
                if (!$bIsThere)
                {
                    $chosenUnits[$chosenUnits.length] = $diagramList[$i][1];
                }  
            }
        } 

        // get information which log type is to be displayed
        var logType = 0;

        if   ($('#DG_day_val').is(":checked"))
        {
            logType = DG_DAYS_30;
        }
        else if ($('#DG_month_val').is(":checked"))
        {
            logType = DG_MONTHS;
        } 
        else if ($('#DG_day_val_100').is(":checked"))
        {
            logType = DG_DAYS_100;
        }
        else
        ;
        
        // create datasets out of the line objects
        var datasets = [];
        var timestamps = [];

        let length = 30;
        if (logType == DG_DAYS_100)
        {
            length = 100;
        }

        if ((logType == DG_DAYS_30) || (logType == DG_DAYS_100))
        {  
            if (length >= blobsArray.Daily.length)
                length = blobsArray.Daily.length;
            // get the array of timestamps of the available last x daily logs
            timestamps = fillTimestamps(blobsArray.Daily, length);
        }
        else // only monthly logs
        {
            // get the array of timestamps of the available monthly logs
            timestamps  = fillTimestamps(blobsArray.Monthly, blobsArray.Monthly.length);
        }

        var secLog = getSecLogObject();

        // create labels
        var labels = timestamps;
        
        lineChartData.axisDetails = [];

        for (var $i = 0; $i < $arrVariables.length; $i++)
        {
            for (var $j = 0; $j < $diagramList.length; $j ++)
            { 
                // do what is to do for each chosen variable
                if ($diagramList[$j][0] == $arrVariables[$i]) 
                {
                    var arrObj = {};
                    //set the label of the variable fro the legend
                    arrObj.label = secLog[$diagramList[$j][0]][lang].long+ ' ' +secLog[$diagramList[$j][0]][lang].abbrev + ' ' + mapUnits[secLog[$diagramList[$j][0]].unit][1] ; 
                    // get the colour for the variable
                    arrObj.borderColor = $diagramList[$j][2];
                    arrObj.fill = false;  // Fläche darunter

                    // get the appropriate data for the variable
                    arrObj.data = [];
                    if ((logType == DG_DAYS_30) || (logType == DG_DAYS_100)) // the appropriate length has already been set above
                    {
                        arrObj.data = getArrObjData(blobsArray.Daily, length, $diagramList[$j][0]);
                    }
                    else
                    {
                        arrObj.data = getArrObjData(blobsArray.Monthly, blobsArray.Monthly.length, $diagramList[$j][0]);
                    }

                    // choose the appropriate axis for the data of this variable
                    if ($diagramList[$j][1] == $chosenUnits[0])
                    {
                        arrObj.yAxisID = 'y-axis-1'; 
                        //arrObj.pointHoverBackgroundColor = 'black';
                        datasets.push(arrObj);
                    }
                    else if ($diagramList[$j][1] == $chosenUnits[1])
                    {
                        arrObj.yAxisID = 'y-axis-2'; 
                        datasets.push(arrObj);
                    }
                    else
                    ;

                    // set the min and max value for the y axis
                    var minVal = Math.min.apply(null, arrObj.data);
                    var maxVal = Math.max.apply(null, arrObj.data);

                    if(!lineChartData.axisDetails[arrObj.yAxisID])
                    {
                        lineChartData.axisDetails[arrObj.yAxisID] = {};
                        lineChartData.axisDetails[arrObj.yAxisID].min = minVal;
                        lineChartData.axisDetails[arrObj.yAxisID].max = maxVal;
                    }
                    else
                    {
                        lineChartData.axisDetails[arrObj.yAxisID].max = Math.max(maxVal, lineChartData.axisDetails[arrObj.yAxisID].max);
                        lineChartData.axisDetails[arrObj.yAxisID].min = Math.min(minVal, lineChartData.axisDetails[arrObj.yAxisID].min);
                    }

                    // for % unit make it always from 0 to 100
                    if ($diagramList[$j][1] == 2) 
                    {
                        lineChartData.axisDetails[arrObj.yAxisID].max = 100;
                        lineChartData.axisDetails[arrObj.yAxisID].min = 0;
                    }
                }
            }
        }

        lineChartData.labels = labels;
        lineChartData.datasets = datasets;
    }

    function myOnLoad($units)
    {
        var ctx = document.getElementById('canvas');
    	//prepare y Axes
        var myYAxes = [];

        var axisDetails = {};
        axisDetails['y-axis-1'] = {};
        axisDetails['y-axis-2'] = {};

        var $chUnits = [];
        if ($units == true)
        {
            $chUnits = $chosenUnits;
            axisDetails['y-axis-1'].min = lineChartData.axisDetails['y-axis-1'].min;
            axisDetails['y-axis-1'].max = lineChartData.axisDetails['y-axis-1'].max;
            if ($chUnits[1] != undefined)
            {
                axisDetails['y-axis-2'].min = lineChartData.axisDetails['y-axis-2'].min;
                axisDetails['y-axis-2'].max = lineChartData.axisDetails['y-axis-2'].max;
            }
        }
        else
        {
            $chUnits = [0,0];
            axisDetails['y-axis-1'].min = 0;
            axisDetails['y-axis-1'].max = 1;
            axisDetails['y-axis-2'].min = 0;
            axisDetails['y-axis-2'].max = 1;
        }

        //var height1 = axisDetails['y-axis-1'].max - axisDetails['y-axis-1'].min;
        var padding1 = 0; //height1 * 0.1;
        axisDetails['y-axis-1'].max += padding1;
        axisDetails['y-axis-1'].min -= padding1;

        //var height2 = axisDetails['y-axis-2'].max - axisDetails['y-axis-2'].min;
        var padding2 = 0; //height2 * 0.1;
        axisDetails['y-axis-2'].max += padding2;
        axisDetails['y-axis-2'].min -= padding2;

    	if (($chUnits[0] != undefined) && ($chUnits[0] != null))
    	{
    	    myYAxes.push( 
    	    {
    		    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
    		    display: true,
    		    position: 'left',
    		    id: 'y-axis-1',
    		    ticks: 
    		    {
    			    fontColor: "white",
                    fontSize: 14,
                    suggestedMin: axisDetails['y-axis-1'].min,
                    suggestedMax: axisDetails['y-axis-1'].max,
    			    callback: function(value, index, values) 
    			    {
    				    return Math.round(value * 100) / 100 + ' ' + mapUnits[$chUnits[0]][2];
                    }
                },
                gridLines:
                {
                    zeroLineColor: 'white'
                }
    	    });
    	    if (($chUnits[1] != undefined) && ($chUnits[1] != null))
    	    {
    	        myYAxes.push( 
    	        {
    		        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
    		        display: true,
    		        position: 'right',
    		        id: 'y-axis-2',
    		        ticks: 
    		        {
    			        fontColor: "white",
                        fontSize: 14,
                        suggestedMin: axisDetails['y-axis-2'].min,
                        suggestedMax: axisDetails['y-axis-2'].max,
    			        callback: function(value, index, values) 
    			        {
    				        return Math.round(value * 100) / 100 + ' ' + mapUnits[$chUnits[1]][2];
    			        }
    		        },

    		        // grid line settings
    		        gridLines: 
    		        {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
    		        },
    	        });
            }
        }
        
        //destroy if any
        if (window.myLine != undefined)
        {
            window.myLine.destroy();
        }

        function recalcTicks(chart, size) 
        {
            var pxPerTickY = 50;
            var pxPerTickX = 50;

            var maxTicksY = Math.floor(size.height / pxPerTickY);
            var axes = chart.options.scales.yAxes;

            for(var i = 0;i< axes.length; i++)
            {
                axes[i].ticks.maxTicksLimit = maxTicksY;
            }

            var maxTicksX = Math.floor(size.width / pxPerTickX);
            chart.options.scales.xAxes[0].ticks.maxTicksLimit = maxTicksX;
        }

    	window.myLine = new Chart(ctx, 
    	{
            type: 'line',
    		data: lineChartData,
    		options: 
    		{
                responsive: true,
                maintainAspectRatio: false,
    			hoverMode: 'index',
    			stacked: false,
    			title: 
    			{
    				display: false, //Radmila
    				text: 'Chart.js Line Chart - Multi Axis'
    			},
    			scales:
    			{
    				yAxes: myYAxes,
    			},
    			legend: 
    			{
    				labels: 
    				{
    					fontColor: "white",
                        fontSize: 10,
                        align: 'start',
                        boxWidth: 7
                    },
                    
                    rtl: false,             
                },
                plugins: 
                {
                    zoom: 
                    {
                        // Container for pan options
                        pan: 
                        {
                            // Boolean to enable panning
                            enabled: true,
        
                            // Panning directions. Remove the appropriate direction to disable 
                            // Eg. 'y' would only allow panning in the y direction
                            mode: 'x',
                            //speed: 1
                            speed: 10
                        },
        
                        // Container for zoom options
                        zoom: 
                        {
                            // Boolean to enable zooming
                            enabled: true,
        
                            // Zooming directions. Remove the appropriate direction to disable 
                            // Eg. 'y' would only allow zooming in the y direction
                            mode: 'x',

                            speed: 0.001,
                            //sensitivity: 0.01
                            sensitivity: 0.3
                        }
                    }
                },
                onResize: recalcTicks
            }
        });

        recalcTicks(window.myLine, { width: window.myLine.width, height: window.myLine.height });
        window.myLine.update();
    }

    function fillTimestamps(arr, length)
    {
        let timestamps = [];
        let j = 0;
        if(arr !== undefined && arr !== "NULL") {
            for (let i = (length-1); i >=0; i--)
            {
                timestamps[j] = arr[i]['TIM'];
                timestamps[j] = timestamps[j].substr(0, 8);
                j++;
            }
        }
        return timestamps;
    }

    function getArrObjData(arr, length, unit)
    {
        let arrData = [];
        for (var k = (length - 1); k >=0; k--)
        {
            arrData.push(arr[k][unit]);
        }
        return arrData;
    }

    const isString$1 = obj => typeof obj === 'string';
    const defer = () => {
      let res;
      let rej;
      const promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
      });
      promise.resolve = res;
      promise.reject = rej;
      return promise;
    };
    const makeString = object => {
      if (object == null) return '';
      return '' + object;
    };
    const copy = (a, s, t) => {
      a.forEach(m => {
        if (s[m]) t[m] = s[m];
      });
    };
    const lastOfPathSeparatorRegExp = /###/g;
    const cleanKey = key => key && key.indexOf('###') > -1 ? key.replace(lastOfPathSeparatorRegExp, '.') : key;
    const canNotTraverseDeeper = object => !object || isString$1(object);
    const getLastOfPath = (object, path, Empty) => {
      const stack = !isString$1(path) ? path : path.split('.');
      let stackIndex = 0;
      while (stackIndex < stack.length - 1) {
        if (canNotTraverseDeeper(object)) return {};
        const key = cleanKey(stack[stackIndex]);
        if (!object[key] && Empty) object[key] = new Empty();
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          object = object[key];
        } else {
          object = {};
        }
        ++stackIndex;
      }
      if (canNotTraverseDeeper(object)) return {};
      return {
        obj: object,
        k: cleanKey(stack[stackIndex])
      };
    };
    const setPath = (object, path, newValue) => {
      const {
        obj,
        k
      } = getLastOfPath(object, path, Object);
      if (obj !== undefined || path.length === 1) {
        obj[k] = newValue;
        return;
      }
      let e = path[path.length - 1];
      let p = path.slice(0, path.length - 1);
      let last = getLastOfPath(object, p, Object);
      while (last.obj === undefined && p.length) {
        e = `${p[p.length - 1]}.${e}`;
        p = p.slice(0, p.length - 1);
        last = getLastOfPath(object, p, Object);
        if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== 'undefined') {
          last.obj = undefined;
        }
      }
      last.obj[`${last.k}.${e}`] = newValue;
    };
    const pushPath = (object, path, newValue, concat) => {
      const {
        obj,
        k
      } = getLastOfPath(object, path, Object);
      obj[k] = obj[k] || [];
      obj[k].push(newValue);
    };
    const getPath = (object, path) => {
      const {
        obj,
        k
      } = getLastOfPath(object, path);
      if (!obj) return undefined;
      if (!Object.prototype.hasOwnProperty.call(obj, k)) return undefined;
      return obj[k];
    };
    const getPathWithDefaults = (data, defaultData, key) => {
      const value = getPath(data, key);
      if (value !== undefined) {
        return value;
      }
      return getPath(defaultData, key);
    };
    const deepExtend = (target, source, overwrite) => {
      for (const prop in source) {
        if (prop !== '__proto__' && prop !== 'constructor') {
          if (prop in target) {
            if (isString$1(target[prop]) || target[prop] instanceof String || isString$1(source[prop]) || source[prop] instanceof String) {
              if (overwrite) target[prop] = source[prop];
            } else {
              deepExtend(target[prop], source[prop], overwrite);
            }
          } else {
            target[prop] = source[prop];
          }
        }
      }
      return target;
    };
    const regexEscape = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    var _entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    const escape = data => {
      if (isString$1(data)) {
        return data.replace(/[&<>"'\/]/g, s => _entityMap[s]);
      }
      return data;
    };
    class RegExpCache {
      constructor(capacity) {
        this.capacity = capacity;
        this.regExpMap = new Map();
        this.regExpQueue = [];
      }
      getRegExp(pattern) {
        const regExpFromCache = this.regExpMap.get(pattern);
        if (regExpFromCache !== undefined) {
          return regExpFromCache;
        }
        const regExpNew = new RegExp(pattern);
        if (this.regExpQueue.length === this.capacity) {
          this.regExpMap.delete(this.regExpQueue.shift());
        }
        this.regExpMap.set(pattern, regExpNew);
        this.regExpQueue.push(pattern);
        return regExpNew;
      }
    }
    const chars = [' ', ',', '?', '!', ';'];
    const looksLikeObjectPathRegExpCache = new RegExpCache(20);
    const looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
      nsSeparator = nsSeparator || '';
      keySeparator = keySeparator || '';
      const possibleChars = chars.filter(c => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
      if (possibleChars.length === 0) return true;
      const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map(c => c === '?' ? '\\?' : c).join('|')})`);
      let matched = !r.test(key);
      if (!matched) {
        const ki = key.indexOf(keySeparator);
        if (ki > 0 && !r.test(key.substring(0, ki))) {
          matched = true;
        }
      }
      return matched;
    };
    const deepFind = (obj, path, keySeparator = '.') => {
      if (!obj) return undefined;
      if (obj[path]) {
        if (!Object.prototype.hasOwnProperty.call(obj, path)) return undefined;
        return obj[path];
      }
      const tokens = path.split(keySeparator);
      let current = obj;
      for (let i = 0; i < tokens.length;) {
        if (!current || typeof current !== 'object') {
          return undefined;
        }
        let next;
        let nextPath = '';
        for (let j = i; j < tokens.length; ++j) {
          if (j !== i) {
            nextPath += keySeparator;
          }
          nextPath += tokens[j];
          next = current[nextPath];
          if (next !== undefined) {
            if (['string', 'number', 'boolean'].indexOf(typeof next) > -1 && j < tokens.length - 1) {
              continue;
            }
            i += j - i + 1;
            break;
          }
        }
        current = next;
      }
      return current;
    };
    const getCleanedCode = code => code?.replace('_', '-');

    const consoleLogger = {
      type: 'logger',
      log(args) {
        this.output('log', args);
      },
      warn(args) {
        this.output('warn', args);
      },
      error(args) {
        this.output('error', args);
      },
      output(type, args) {
        console?.[type]?.apply?.(console, args);
      }
    };
    class Logger {
      constructor(concreteLogger, options = {}) {
        this.init(concreteLogger, options);
      }
      init(concreteLogger, options = {}) {
        this.prefix = options.prefix || 'i18next:';
        this.logger = concreteLogger || consoleLogger;
        this.options = options;
        this.debug = options.debug;
      }
      log(...args) {
        return this.forward(args, 'log', '', true);
      }
      warn(...args) {
        return this.forward(args, 'warn', '', true);
      }
      error(...args) {
        return this.forward(args, 'error', '');
      }
      deprecate(...args) {
        return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
      }
      forward(args, lvl, prefix, debugOnly) {
        if (debugOnly && !this.debug) return null;
        if (isString$1(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
        return this.logger[lvl](args);
      }
      create(moduleName) {
        return new Logger(this.logger, {
          ...{
            prefix: `${this.prefix}:${moduleName}:`
          },
          ...this.options
        });
      }
      clone(options) {
        options = options || this.options;
        options.prefix = options.prefix || this.prefix;
        return new Logger(this.logger, options);
      }
    }
    var baseLogger = new Logger();

    class EventEmitter {
      constructor() {
        this.observers = {};
      }
      on(events, listener) {
        events.split(' ').forEach(event => {
          if (!this.observers[event]) this.observers[event] = new Map();
          const numListeners = this.observers[event].get(listener) || 0;
          this.observers[event].set(listener, numListeners + 1);
        });
        return this;
      }
      off(event, listener) {
        if (!this.observers[event]) return;
        if (!listener) {
          delete this.observers[event];
          return;
        }
        this.observers[event].delete(listener);
      }
      emit(event, ...args) {
        if (this.observers[event]) {
          const cloned = Array.from(this.observers[event].entries());
          cloned.forEach(([observer, numTimesAdded]) => {
            for (let i = 0; i < numTimesAdded; i++) {
              observer(...args);
            }
          });
        }
        if (this.observers['*']) {
          const cloned = Array.from(this.observers['*'].entries());
          cloned.forEach(([observer, numTimesAdded]) => {
            for (let i = 0; i < numTimesAdded; i++) {
              observer.apply(observer, [event, ...args]);
            }
          });
        }
      }
    }

    class ResourceStore extends EventEmitter {
      constructor(data, options = {
        ns: ['translation'],
        defaultNS: 'translation'
      }) {
        super();
        this.data = data || {};
        this.options = options;
        if (this.options.keySeparator === undefined) {
          this.options.keySeparator = '.';
        }
        if (this.options.ignoreJSONStructure === undefined) {
          this.options.ignoreJSONStructure = true;
        }
      }
      addNamespaces(ns) {
        if (this.options.ns.indexOf(ns) < 0) {
          this.options.ns.push(ns);
        }
      }
      removeNamespaces(ns) {
        const index = this.options.ns.indexOf(ns);
        if (index > -1) {
          this.options.ns.splice(index, 1);
        }
      }
      getResource(lng, ns, key, options = {}) {
        const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
        const ignoreJSONStructure = options.ignoreJSONStructure !== undefined ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
        let path;
        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
        } else {
          path = [lng, ns];
          if (key) {
            if (Array.isArray(key)) {
              path.push(...key);
            } else if (isString$1(key) && keySeparator) {
              path.push(...key.split(keySeparator));
            } else {
              path.push(key);
            }
          }
        }
        const result = getPath(this.data, path);
        if (!result && !ns && !key && lng.indexOf('.') > -1) {
          lng = path[0];
          ns = path[1];
          key = path.slice(2).join('.');
        }
        if (result || !ignoreJSONStructure || !isString$1(key)) return result;
        return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
      }
      addResource(lng, ns, key, value, options = {
        silent: false
      }) {
        const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
        let path = [lng, ns];
        if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
          value = ns;
          ns = path[1];
        }
        this.addNamespaces(ns);
        setPath(this.data, path, value);
        if (!options.silent) this.emit('added', lng, ns, key, value);
      }
      addResources(lng, ns, resources, options = {
        silent: false
      }) {
        for (const m in resources) {
          if (isString$1(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], {
            silent: true
          });
        }
        if (!options.silent) this.emit('added', lng, ns, resources);
      }
      addResourceBundle(lng, ns, resources, deep, overwrite, options = {
        silent: false,
        skipCopy: false
      }) {
        let path = [lng, ns];
        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
          deep = resources;
          resources = ns;
          ns = path[1];
        }
        this.addNamespaces(ns);
        let pack = getPath(this.data, path) || {};
        if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
        if (deep) {
          deepExtend(pack, resources, overwrite);
        } else {
          pack = {
            ...pack,
            ...resources
          };
        }
        setPath(this.data, path, pack);
        if (!options.silent) this.emit('added', lng, ns, resources);
      }
      removeResourceBundle(lng, ns) {
        if (this.hasResourceBundle(lng, ns)) {
          delete this.data[lng][ns];
        }
        this.removeNamespaces(ns);
        this.emit('removed', lng, ns);
      }
      hasResourceBundle(lng, ns) {
        return this.getResource(lng, ns) !== undefined;
      }
      getResourceBundle(lng, ns) {
        if (!ns) ns = this.options.defaultNS;
        return this.getResource(lng, ns);
      }
      getDataByLanguage(lng) {
        return this.data[lng];
      }
      hasLanguageSomeTranslations(lng) {
        const data = this.getDataByLanguage(lng);
        const n = data && Object.keys(data) || [];
        return !!n.find(v => data[v] && Object.keys(data[v]).length > 0);
      }
      toJSON() {
        return this.data;
      }
    }

    var postProcessor = {
      processors: {},
      addPostProcessor(module) {
        this.processors[module.name] = module;
      },
      handle(processors, value, key, options, translator) {
        processors.forEach(processor => {
          value = this.processors[processor]?.process(value, key, options, translator) ?? value;
        });
        return value;
      }
    };

    const PATH_KEY = Symbol('i18next/PATH_KEY');
    function createProxy() {
      const state = [];
      const handler = Object.create(null);
      let proxy;
      handler.get = (target, key) => {
        proxy?.revoke?.();
        if (key === PATH_KEY) return state;
        state.push(key);
        proxy = Proxy.revocable(target, handler);
        return proxy.proxy;
      };
      return Proxy.revocable(Object.create(null), handler).proxy;
    }
    function keysFromSelector(selector, opts) {
      const {
        [PATH_KEY]: path
      } = selector(createProxy());
      return path.join(opts?.keySeparator ?? '.');
    }

    const checkedLoadedFor = {};
    const shouldHandleAsObject = res => !isString$1(res) && typeof res !== 'boolean' && typeof res !== 'number';
    class Translator extends EventEmitter {
      constructor(services, options = {}) {
        super();
        copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, this);
        this.options = options;
        if (this.options.keySeparator === undefined) {
          this.options.keySeparator = '.';
        }
        this.logger = baseLogger.create('translator');
      }
      changeLanguage(lng) {
        if (lng) this.language = lng;
      }
      exists(key, o = {
        interpolation: {}
      }) {
        const opt = {
          ...o
        };
        if (key == null) return false;
        const resolved = this.resolve(key, opt);
        if (resolved?.res === undefined) return false;
        const isObject = shouldHandleAsObject(resolved.res);
        if (opt.returnObjects === false && isObject) {
          return false;
        }
        return true;
      }
      extractFromKey(key, opt) {
        let nsSeparator = opt.nsSeparator !== undefined ? opt.nsSeparator : this.options.nsSeparator;
        if (nsSeparator === undefined) nsSeparator = ':';
        const keySeparator = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;
        let namespaces = opt.ns || this.options.defaultNS || [];
        const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
        const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !opt.keySeparator && !this.options.userDefinedNsSeparator && !opt.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
        if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
          const m = key.match(this.interpolator.nestingRegexp);
          if (m && m.length > 0) {
            return {
              key,
              namespaces: isString$1(namespaces) ? [namespaces] : namespaces
            };
          }
          const parts = key.split(nsSeparator);
          if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
          key = parts.join(keySeparator);
        }
        return {
          key,
          namespaces: isString$1(namespaces) ? [namespaces] : namespaces
        };
      }
      translate(keys, o, lastKey) {
        let opt = typeof o === 'object' ? {
          ...o
        } : o;
        if (typeof opt !== 'object' && this.options.overloadTranslationOptionHandler) {
          opt = this.options.overloadTranslationOptionHandler(arguments);
        }
        if (typeof opt === 'object') opt = {
          ...opt
        };
        if (!opt) opt = {};
        if (keys == null) return '';
        if (typeof keys === 'function') keys = keysFromSelector(keys, {
          ...this.options,
          ...opt
        });
        if (!Array.isArray(keys)) keys = [String(keys)];
        const returnDetails = opt.returnDetails !== undefined ? opt.returnDetails : this.options.returnDetails;
        const keySeparator = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;
        const {
          key,
          namespaces
        } = this.extractFromKey(keys[keys.length - 1], opt);
        const namespace = namespaces[namespaces.length - 1];
        let nsSeparator = opt.nsSeparator !== undefined ? opt.nsSeparator : this.options.nsSeparator;
        if (nsSeparator === undefined) nsSeparator = ':';
        const lng = opt.lng || this.language;
        const appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
        if (lng?.toLowerCase() === 'cimode') {
          if (appendNamespaceToCIMode) {
            if (returnDetails) {
              return {
                res: `${namespace}${nsSeparator}${key}`,
                usedKey: key,
                exactUsedKey: key,
                usedLng: lng,
                usedNS: namespace,
                usedParams: this.getUsedParamsDetails(opt)
              };
            }
            return `${namespace}${nsSeparator}${key}`;
          }
          if (returnDetails) {
            return {
              res: key,
              usedKey: key,
              exactUsedKey: key,
              usedLng: lng,
              usedNS: namespace,
              usedParams: this.getUsedParamsDetails(opt)
            };
          }
          return key;
        }
        const resolved = this.resolve(keys, opt);
        let res = resolved?.res;
        const resUsedKey = resolved?.usedKey || key;
        const resExactUsedKey = resolved?.exactUsedKey || key;
        const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
        const joinArrays = opt.joinArrays !== undefined ? opt.joinArrays : this.options.joinArrays;
        const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
        const needsPluralHandling = opt.count !== undefined && !isString$1(opt.count);
        const hasDefaultValue = Translator.hasDefaultValue(opt);
        const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, opt) : '';
        const defaultValueSuffixOrdinalFallback = opt.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, {
          ordinal: false
        }) : '';
        const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
        const defaultValue = needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] || opt[`defaultValue${defaultValueSuffix}`] || opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] || opt.defaultValue;
        let resForObjHndl = res;
        if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
          resForObjHndl = defaultValue;
        }
        const handleAsObject = shouldHandleAsObject(resForObjHndl);
        const resType = Object.prototype.toString.apply(resForObjHndl);
        if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && noObject.indexOf(resType) < 0 && !(isString$1(joinArrays) && Array.isArray(resForObjHndl))) {
          if (!opt.returnObjects && !this.options.returnObjects) {
            if (!this.options.returnedObjectHandler) {
              this.logger.warn('accessing an object - but returnObjects options is not enabled!');
            }
            const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
              ...opt,
              ns: namespaces
            }) : `key '${key} (${this.language})' returned an object instead of string.`;
            if (returnDetails) {
              resolved.res = r;
              resolved.usedParams = this.getUsedParamsDetails(opt);
              return resolved;
            }
            return r;
          }
          if (keySeparator) {
            const resTypeIsArray = Array.isArray(resForObjHndl);
            const copy = resTypeIsArray ? [] : {};
            const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
            for (const m in resForObjHndl) {
              if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
                const deepKey = `${newKeyToUse}${keySeparator}${m}`;
                if (hasDefaultValue && !res) {
                  copy[m] = this.translate(deepKey, {
                    ...opt,
                    defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : undefined,
                    ...{
                      joinArrays: false,
                      ns: namespaces
                    }
                  });
                } else {
                  copy[m] = this.translate(deepKey, {
                    ...opt,
                    ...{
                      joinArrays: false,
                      ns: namespaces
                    }
                  });
                }
                if (copy[m] === deepKey) copy[m] = resForObjHndl[m];
              }
            }
            res = copy;
          }
        } else if (handleAsObjectInI18nFormat && isString$1(joinArrays) && Array.isArray(res)) {
          res = res.join(joinArrays);
          if (res) res = this.extendTranslation(res, keys, opt, lastKey);
        } else {
          let usedDefault = false;
          let usedKey = false;
          if (!this.isValidLookup(res) && hasDefaultValue) {
            usedDefault = true;
            res = defaultValue;
          }
          if (!this.isValidLookup(res)) {
            usedKey = true;
            res = key;
          }
          const missingKeyNoValueFallbackToKey = opt.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
          const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? undefined : res;
          const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
          if (usedKey || usedDefault || updateMissing) {
            this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? defaultValue : res);
            if (keySeparator) {
              const fk = this.resolve(key, {
                ...opt,
                keySeparator: false
              });
              if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
            }
            let lngs = [];
            const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);
            if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
              for (let i = 0; i < fallbackLngs.length; i++) {
                lngs.push(fallbackLngs[i]);
              }
            } else if (this.options.saveMissingTo === 'all') {
              lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
            } else {
              lngs.push(opt.lng || this.language);
            }
            const send = (l, k, specificDefaultValue) => {
              const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
              if (this.options.missingKeyHandler) {
                this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, opt);
              } else if (this.backendConnector?.saveMissing) {
                this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, opt);
              }
              this.emit('missingKey', l, namespace, k, res);
            };
            if (this.options.saveMissing) {
              if (this.options.saveMissingPlurals && needsPluralHandling) {
                lngs.forEach(language => {
                  const suffixes = this.pluralResolver.getSuffixes(language, opt);
                  if (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                    suffixes.push(`${this.options.pluralSeparator}zero`);
                  }
                  suffixes.forEach(suffix => {
                    send([language], key + suffix, opt[`defaultValue${suffix}`] || defaultValue);
                  });
                });
              } else {
                send(lngs, key, defaultValue);
              }
            }
          }
          res = this.extendTranslation(res, keys, opt, resolved, lastKey);
          if (usedKey && res === key && this.options.appendNamespaceToMissingKey) {
            res = `${namespace}${nsSeparator}${key}`;
          }
          if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
            res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}${nsSeparator}${key}` : key, usedDefault ? res : undefined, opt);
          }
        }
        if (returnDetails) {
          resolved.res = res;
          resolved.usedParams = this.getUsedParamsDetails(opt);
          return resolved;
        }
        return res;
      }
      extendTranslation(res, key, opt, resolved, lastKey) {
        if (this.i18nFormat?.parse) {
          res = this.i18nFormat.parse(res, {
            ...this.options.interpolation.defaultVariables,
            ...opt
          }, opt.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
            resolved
          });
        } else if (!opt.skipInterpolation) {
          if (opt.interpolation) this.interpolator.init({
            ...opt,
            ...{
              interpolation: {
                ...this.options.interpolation,
                ...opt.interpolation
              }
            }
          });
          const skipOnVariables = isString$1(res) && (opt?.interpolation?.skipOnVariables !== undefined ? opt.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
          let nestBef;
          if (skipOnVariables) {
            const nb = res.match(this.interpolator.nestingRegexp);
            nestBef = nb && nb.length;
          }
          let data = opt.replace && !isString$1(opt.replace) ? opt.replace : opt;
          if (this.options.interpolation.defaultVariables) data = {
            ...this.options.interpolation.defaultVariables,
            ...data
          };
          res = this.interpolator.interpolate(res, data, opt.lng || this.language || resolved.usedLng, opt);
          if (skipOnVariables) {
            const na = res.match(this.interpolator.nestingRegexp);
            const nestAft = na && na.length;
            if (nestBef < nestAft) opt.nest = false;
          }
          if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
          if (opt.nest !== false) res = this.interpolator.nest(res, (...args) => {
            if (lastKey?.[0] === args[0] && !opt.context) {
              this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
              return null;
            }
            return this.translate(...args, key);
          }, opt);
          if (opt.interpolation) this.interpolator.reset();
        }
        const postProcess = opt.postProcess || this.options.postProcess;
        const postProcessorNames = isString$1(postProcess) ? [postProcess] : postProcess;
        if (res != null && postProcessorNames?.length && opt.applyPostProcessor !== false) {
          res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
            i18nResolved: {
              ...resolved,
              usedParams: this.getUsedParamsDetails(opt)
            },
            ...opt
          } : opt, this);
        }
        return res;
      }
      resolve(keys, opt = {}) {
        let found;
        let usedKey;
        let exactUsedKey;
        let usedLng;
        let usedNS;
        if (isString$1(keys)) keys = [keys];
        keys.forEach(k => {
          if (this.isValidLookup(found)) return;
          const extracted = this.extractFromKey(k, opt);
          const key = extracted.key;
          usedKey = key;
          let namespaces = extracted.namespaces;
          if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
          const needsPluralHandling = opt.count !== undefined && !isString$1(opt.count);
          const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
          const needsContextHandling = opt.context !== undefined && (isString$1(opt.context) || typeof opt.context === 'number') && opt.context !== '';
          const codes = opt.lngs ? opt.lngs : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
          namespaces.forEach(ns => {
            if (this.isValidLookup(found)) return;
            usedNS = ns;
            if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
              checkedLoadedFor[`${codes[0]}-${ns}`] = true;
              this.logger.warn(`key "${usedKey}" for languages "${codes.join(', ')}" won't get resolved as namespace "${usedNS}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
            }
            codes.forEach(code => {
              if (this.isValidLookup(found)) return;
              usedLng = code;
              const finalKeys = [key];
              if (this.i18nFormat?.addLookupKeys) {
                this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
              } else {
                let pluralSuffix;
                if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
                const zeroSuffix = `${this.options.pluralSeparator}zero`;
                const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                if (needsPluralHandling) {
                  if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                    finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                  }
                  finalKeys.push(key + pluralSuffix);
                  if (needsZeroSuffixLookup) {
                    finalKeys.push(key + zeroSuffix);
                  }
                }
                if (needsContextHandling) {
                  const contextKey = `${key}${this.options.contextSeparator || '_'}${opt.context}`;
                  finalKeys.push(contextKey);
                  if (needsPluralHandling) {
                    if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                      finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                    }
                    finalKeys.push(contextKey + pluralSuffix);
                    if (needsZeroSuffixLookup) {
                      finalKeys.push(contextKey + zeroSuffix);
                    }
                  }
                }
              }
              let possibleKey;
              while (possibleKey = finalKeys.pop()) {
                if (!this.isValidLookup(found)) {
                  exactUsedKey = possibleKey;
                  found = this.getResource(code, ns, possibleKey, opt);
                }
              }
            });
          });
        });
        return {
          res: found,
          usedKey,
          exactUsedKey,
          usedLng,
          usedNS
        };
      }
      isValidLookup(res) {
        return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
      }
      getResource(code, ns, key, options = {}) {
        if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
        return this.resourceStore.getResource(code, ns, key, options);
      }
      getUsedParamsDetails(options = {}) {
        const optionsKeys = ['defaultValue', 'ordinal', 'context', 'replace', 'lng', 'lngs', 'fallbackLng', 'ns', 'keySeparator', 'nsSeparator', 'returnObjects', 'returnDetails', 'joinArrays', 'postProcess', 'interpolation'];
        const useOptionsReplaceForData = options.replace && !isString$1(options.replace);
        let data = useOptionsReplaceForData ? options.replace : options;
        if (useOptionsReplaceForData && typeof options.count !== 'undefined') {
          data.count = options.count;
        }
        if (this.options.interpolation.defaultVariables) {
          data = {
            ...this.options.interpolation.defaultVariables,
            ...data
          };
        }
        if (!useOptionsReplaceForData) {
          data = {
            ...data
          };
          for (const key of optionsKeys) {
            delete data[key];
          }
        }
        return data;
      }
      static hasDefaultValue(options) {
        const prefix = 'defaultValue';
        for (const option in options) {
          if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && undefined !== options[option]) {
            return true;
          }
        }
        return false;
      }
    }

    class LanguageUtil {
      constructor(options) {
        this.options = options;
        this.supportedLngs = this.options.supportedLngs || false;
        this.logger = baseLogger.create('languageUtils');
      }
      getScriptPartFromCode(code) {
        code = getCleanedCode(code);
        if (!code || code.indexOf('-') < 0) return null;
        const p = code.split('-');
        if (p.length === 2) return null;
        p.pop();
        if (p[p.length - 1].toLowerCase() === 'x') return null;
        return this.formatLanguageCode(p.join('-'));
      }
      getLanguagePartFromCode(code) {
        code = getCleanedCode(code);
        if (!code || code.indexOf('-') < 0) return code;
        const p = code.split('-');
        return this.formatLanguageCode(p[0]);
      }
      formatLanguageCode(code) {
        if (isString$1(code) && code.indexOf('-') > -1) {
          let formattedCode;
          try {
            formattedCode = Intl.getCanonicalLocales(code)[0];
          } catch (e) {}
          if (formattedCode && this.options.lowerCaseLng) {
            formattedCode = formattedCode.toLowerCase();
          }
          if (formattedCode) return formattedCode;
          if (this.options.lowerCaseLng) {
            return code.toLowerCase();
          }
          return code;
        }
        return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
      }
      isSupportedCode(code) {
        if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
          code = this.getLanguagePartFromCode(code);
        }
        return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
      }
      getBestMatchFromCodes(codes) {
        if (!codes) return null;
        let found;
        codes.forEach(code => {
          if (found) return;
          const cleanedLng = this.formatLanguageCode(code);
          if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
        });
        if (!found && this.options.supportedLngs) {
          codes.forEach(code => {
            if (found) return;
            const lngScOnly = this.getScriptPartFromCode(code);
            if (this.isSupportedCode(lngScOnly)) return found = lngScOnly;
            const lngOnly = this.getLanguagePartFromCode(code);
            if (this.isSupportedCode(lngOnly)) return found = lngOnly;
            found = this.options.supportedLngs.find(supportedLng => {
              if (supportedLng === lngOnly) return supportedLng;
              if (supportedLng.indexOf('-') < 0 && lngOnly.indexOf('-') < 0) return;
              if (supportedLng.indexOf('-') > 0 && lngOnly.indexOf('-') < 0 && supportedLng.substring(0, supportedLng.indexOf('-')) === lngOnly) return supportedLng;
              if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
            });
          });
        }
        if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
        return found;
      }
      getFallbackCodes(fallbacks, code) {
        if (!fallbacks) return [];
        if (typeof fallbacks === 'function') fallbacks = fallbacks(code);
        if (isString$1(fallbacks)) fallbacks = [fallbacks];
        if (Array.isArray(fallbacks)) return fallbacks;
        if (!code) return fallbacks.default || [];
        let found = fallbacks[code];
        if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
        if (!found) found = fallbacks[this.formatLanguageCode(code)];
        if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
        if (!found) found = fallbacks.default;
        return found || [];
      }
      toResolveHierarchy(code, fallbackCode) {
        const fallbackCodes = this.getFallbackCodes((fallbackCode === false ? [] : fallbackCode) || this.options.fallbackLng || [], code);
        const codes = [];
        const addCode = c => {
          if (!c) return;
          if (this.isSupportedCode(c)) {
            codes.push(c);
          } else {
            this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
          }
        };
        if (isString$1(code) && (code.indexOf('-') > -1 || code.indexOf('_') > -1)) {
          if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
          if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
          if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
        } else if (isString$1(code)) {
          addCode(this.formatLanguageCode(code));
        }
        fallbackCodes.forEach(fc => {
          if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
        });
        return codes;
      }
    }

    const suffixesOrder = {
      zero: 0,
      one: 1,
      two: 2,
      few: 3,
      many: 4,
      other: 5
    };
    const dummyRule = {
      select: count => count === 1 ? 'one' : 'other',
      resolvedOptions: () => ({
        pluralCategories: ['one', 'other']
      })
    };
    class PluralResolver {
      constructor(languageUtils, options = {}) {
        this.languageUtils = languageUtils;
        this.options = options;
        this.logger = baseLogger.create('pluralResolver');
        this.pluralRulesCache = {};
      }
      addRule(lng, obj) {
        this.rules[lng] = obj;
      }
      clearCache() {
        this.pluralRulesCache = {};
      }
      getRule(code, options = {}) {
        const cleanedCode = getCleanedCode(code === 'dev' ? 'en' : code);
        const type = options.ordinal ? 'ordinal' : 'cardinal';
        const cacheKey = JSON.stringify({
          cleanedCode,
          type
        });
        if (cacheKey in this.pluralRulesCache) {
          return this.pluralRulesCache[cacheKey];
        }
        let rule;
        try {
          rule = new Intl.PluralRules(cleanedCode, {
            type
          });
        } catch (err) {
          if (!Intl) {
            this.logger.error('No Intl support, please use an Intl polyfill!');
            return dummyRule;
          }
          if (!code.match(/-|_/)) return dummyRule;
          const lngPart = this.languageUtils.getLanguagePartFromCode(code);
          rule = this.getRule(lngPart, options);
        }
        this.pluralRulesCache[cacheKey] = rule;
        return rule;
      }
      needsPlural(code, options = {}) {
        let rule = this.getRule(code, options);
        if (!rule) rule = this.getRule('dev', options);
        return rule?.resolvedOptions().pluralCategories.length > 1;
      }
      getPluralFormsOfKey(code, key, options = {}) {
        return this.getSuffixes(code, options).map(suffix => `${key}${suffix}`);
      }
      getSuffixes(code, options = {}) {
        let rule = this.getRule(code, options);
        if (!rule) rule = this.getRule('dev', options);
        if (!rule) return [];
        return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map(pluralCategory => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${pluralCategory}`);
      }
      getSuffix(code, count, options = {}) {
        const rule = this.getRule(code, options);
        if (rule) {
          return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${rule.select(count)}`;
        }
        this.logger.warn(`no plural rule found for: ${code}`);
        return this.getSuffix('dev', count, options);
      }
    }

    const deepFindWithDefaults = (data, defaultData, key, keySeparator = '.', ignoreJSONStructure = true) => {
      let path = getPathWithDefaults(data, defaultData, key);
      if (!path && ignoreJSONStructure && isString$1(key)) {
        path = deepFind(data, key, keySeparator);
        if (path === undefined) path = deepFind(defaultData, key, keySeparator);
      }
      return path;
    };
    const regexSafe = val => val.replace(/\$/g, '$$$$');
    class Interpolator {
      constructor(options = {}) {
        this.logger = baseLogger.create('interpolator');
        this.options = options;
        this.format = options?.interpolation?.format || (value => value);
        this.init(options);
      }
      init(options = {}) {
        if (!options.interpolation) options.interpolation = {
          escapeValue: true
        };
        const {
          escape: escape$1,
          escapeValue,
          useRawValueToEscape,
          prefix,
          prefixEscaped,
          suffix,
          suffixEscaped,
          formatSeparator,
          unescapeSuffix,
          unescapePrefix,
          nestingPrefix,
          nestingPrefixEscaped,
          nestingSuffix,
          nestingSuffixEscaped,
          nestingOptionsSeparator,
          maxReplaces,
          alwaysFormat
        } = options.interpolation;
        this.escape = escape$1 !== undefined ? escape$1 : escape;
        this.escapeValue = escapeValue !== undefined ? escapeValue : true;
        this.useRawValueToEscape = useRawValueToEscape !== undefined ? useRawValueToEscape : false;
        this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || '{{';
        this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || '}}';
        this.formatSeparator = formatSeparator || ',';
        this.unescapePrefix = unescapeSuffix ? '' : unescapePrefix || '-';
        this.unescapeSuffix = this.unescapePrefix ? '' : unescapeSuffix || '';
        this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape('$t(');
        this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(')');
        this.nestingOptionsSeparator = nestingOptionsSeparator || ',';
        this.maxReplaces = maxReplaces || 1000;
        this.alwaysFormat = alwaysFormat !== undefined ? alwaysFormat : false;
        this.resetRegExp();
      }
      reset() {
        if (this.options) this.init(this.options);
      }
      resetRegExp() {
        const getOrResetRegExp = (existingRegExp, pattern) => {
          if (existingRegExp?.source === pattern) {
            existingRegExp.lastIndex = 0;
            return existingRegExp;
          }
          return new RegExp(pattern, 'g');
        };
        this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
        this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
        this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
      }
      interpolate(str, data, lng, options) {
        let match;
        let value;
        let replaces;
        const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
        const handleFormat = key => {
          if (key.indexOf(this.formatSeparator) < 0) {
            const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
            return this.alwaysFormat ? this.format(path, undefined, lng, {
              ...options,
              ...data,
              interpolationkey: key
            }) : path;
          }
          const p = key.split(this.formatSeparator);
          const k = p.shift().trim();
          const f = p.join(this.formatSeparator).trim();
          return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
            ...options,
            ...data,
            interpolationkey: k
          });
        };
        this.resetRegExp();
        const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
        const skipOnVariables = options?.interpolation?.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
        const todos = [{
          regex: this.regexpUnescape,
          safeValue: val => regexSafe(val)
        }, {
          regex: this.regexp,
          safeValue: val => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
        }];
        todos.forEach(todo => {
          replaces = 0;
          while (match = todo.regex.exec(str)) {
            const matchedVar = match[1].trim();
            value = handleFormat(matchedVar);
            if (value === undefined) {
              if (typeof missingInterpolationHandler === 'function') {
                const temp = missingInterpolationHandler(str, match, options);
                value = isString$1(temp) ? temp : '';
              } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
                value = '';
              } else if (skipOnVariables) {
                value = match[0];
                continue;
              } else {
                this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
                value = '';
              }
            } else if (!isString$1(value) && !this.useRawValueToEscape) {
              value = makeString(value);
            }
            const safeValue = todo.safeValue(value);
            str = str.replace(match[0], safeValue);
            if (skipOnVariables) {
              todo.regex.lastIndex += value.length;
              todo.regex.lastIndex -= match[0].length;
            } else {
              todo.regex.lastIndex = 0;
            }
            replaces++;
            if (replaces >= this.maxReplaces) {
              break;
            }
          }
        });
        return str;
      }
      nest(str, fc, options = {}) {
        let match;
        let value;
        let clonedOptions;
        const handleHasOptions = (key, inheritedOptions) => {
          const sep = this.nestingOptionsSeparator;
          if (key.indexOf(sep) < 0) return key;
          const c = key.split(new RegExp(`${sep}[ ]*{`));
          let optionsString = `{${c[1]}`;
          key = c[0];
          optionsString = this.interpolate(optionsString, clonedOptions);
          const matchedSingleQuotes = optionsString.match(/'/g);
          const matchedDoubleQuotes = optionsString.match(/"/g);
          if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
            optionsString = optionsString.replace(/'/g, '"');
          }
          try {
            clonedOptions = JSON.parse(optionsString);
            if (inheritedOptions) clonedOptions = {
              ...inheritedOptions,
              ...clonedOptions
            };
          } catch (e) {
            this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
            return `${key}${sep}${optionsString}`;
          }
          if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
          return key;
        };
        while (match = this.nestingRegexp.exec(str)) {
          let formatters = [];
          clonedOptions = {
            ...options
          };
          clonedOptions = clonedOptions.replace && !isString$1(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
          clonedOptions.applyPostProcessor = false;
          delete clonedOptions.defaultValue;
          const keyEndIndex = /{.*}/.test(match[1]) ? match[1].lastIndexOf('}') + 1 : match[1].indexOf(this.formatSeparator);
          if (keyEndIndex !== -1) {
            formatters = match[1].slice(keyEndIndex).split(this.formatSeparator).map(elem => elem.trim()).filter(Boolean);
            match[1] = match[1].slice(0, keyEndIndex);
          }
          value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
          if (value && match[0] === str && !isString$1(value)) return value;
          if (!isString$1(value)) value = makeString(value);
          if (!value) {
            this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
            value = '';
          }
          if (formatters.length) {
            value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
              ...options,
              interpolationkey: match[1].trim()
            }), value.trim());
          }
          str = str.replace(match[0], value);
          this.regexp.lastIndex = 0;
        }
        return str;
      }
    }

    const parseFormatStr = formatStr => {
      let formatName = formatStr.toLowerCase().trim();
      const formatOptions = {};
      if (formatStr.indexOf('(') > -1) {
        const p = formatStr.split('(');
        formatName = p[0].toLowerCase().trim();
        const optStr = p[1].substring(0, p[1].length - 1);
        if (formatName === 'currency' && optStr.indexOf(':') < 0) {
          if (!formatOptions.currency) formatOptions.currency = optStr.trim();
        } else if (formatName === 'relativetime' && optStr.indexOf(':') < 0) {
          if (!formatOptions.range) formatOptions.range = optStr.trim();
        } else {
          const opts = optStr.split(';');
          opts.forEach(opt => {
            if (opt) {
              const [key, ...rest] = opt.split(':');
              const val = rest.join(':').trim().replace(/^'+|'+$/g, '');
              const trimmedKey = key.trim();
              if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
              if (val === 'false') formatOptions[trimmedKey] = false;
              if (val === 'true') formatOptions[trimmedKey] = true;
              if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
            }
          });
        }
      }
      return {
        formatName,
        formatOptions
      };
    };
    const createCachedFormatter = fn => {
      const cache = {};
      return (v, l, o) => {
        let optForCache = o;
        if (o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey]) {
          optForCache = {
            ...optForCache,
            [o.interpolationkey]: undefined
          };
        }
        const key = l + JSON.stringify(optForCache);
        let frm = cache[key];
        if (!frm) {
          frm = fn(getCleanedCode(l), o);
          cache[key] = frm;
        }
        return frm(v);
      };
    };
    const createNonCachedFormatter = fn => (v, l, o) => fn(getCleanedCode(l), o)(v);
    class Formatter {
      constructor(options = {}) {
        this.logger = baseLogger.create('formatter');
        this.options = options;
        this.init(options);
      }
      init(services, options = {
        interpolation: {}
      }) {
        this.formatSeparator = options.interpolation.formatSeparator || ',';
        const cf = options.cacheInBuiltFormats ? createCachedFormatter : createNonCachedFormatter;
        this.formats = {
          number: cf((lng, opt) => {
            const formatter = new Intl.NumberFormat(lng, {
              ...opt
            });
            return val => formatter.format(val);
          }),
          currency: cf((lng, opt) => {
            const formatter = new Intl.NumberFormat(lng, {
              ...opt,
              style: 'currency'
            });
            return val => formatter.format(val);
          }),
          datetime: cf((lng, opt) => {
            const formatter = new Intl.DateTimeFormat(lng, {
              ...opt
            });
            return val => formatter.format(val);
          }),
          relativetime: cf((lng, opt) => {
            const formatter = new Intl.RelativeTimeFormat(lng, {
              ...opt
            });
            return val => formatter.format(val, opt.range || 'day');
          }),
          list: cf((lng, opt) => {
            const formatter = new Intl.ListFormat(lng, {
              ...opt
            });
            return val => formatter.format(val);
          })
        };
      }
      add(name, fc) {
        this.formats[name.toLowerCase().trim()] = fc;
      }
      addCached(name, fc) {
        this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
      }
      format(value, format, lng, options = {}) {
        const formats = format.split(this.formatSeparator);
        if (formats.length > 1 && formats[0].indexOf('(') > 1 && formats[0].indexOf(')') < 0 && formats.find(f => f.indexOf(')') > -1)) {
          const lastIndex = formats.findIndex(f => f.indexOf(')') > -1);
          formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
        }
        const result = formats.reduce((mem, f) => {
          const {
            formatName,
            formatOptions
          } = parseFormatStr(f);
          if (this.formats[formatName]) {
            let formatted = mem;
            try {
              const valOptions = options?.formatParams?.[options.interpolationkey] || {};
              const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
              formatted = this.formats[formatName](mem, l, {
                ...formatOptions,
                ...options,
                ...valOptions
              });
            } catch (error) {
              this.logger.warn(error);
            }
            return formatted;
          } else {
            this.logger.warn(`there was no format function for ${formatName}`);
          }
          return mem;
        }, value);
        return result;
      }
    }

    const removePending = (q, name) => {
      if (q.pending[name] !== undefined) {
        delete q.pending[name];
        q.pendingCount--;
      }
    };
    class Connector extends EventEmitter {
      constructor(backend, store, services, options = {}) {
        super();
        this.backend = backend;
        this.store = store;
        this.services = services;
        this.languageUtils = services.languageUtils;
        this.options = options;
        this.logger = baseLogger.create('backendConnector');
        this.waitingReads = [];
        this.maxParallelReads = options.maxParallelReads || 10;
        this.readingCalls = 0;
        this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
        this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
        this.state = {};
        this.queue = [];
        this.backend?.init?.(services, options.backend, options);
      }
      queueLoad(languages, namespaces, options, callback) {
        const toLoad = {};
        const pending = {};
        const toLoadLanguages = {};
        const toLoadNamespaces = {};
        languages.forEach(lng => {
          let hasAllNamespaces = true;
          namespaces.forEach(ns => {
            const name = `${lng}|${ns}`;
            if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
              this.state[name] = 2;
            } else if (this.state[name] < 0) ; else if (this.state[name] === 1) {
              if (pending[name] === undefined) pending[name] = true;
            } else {
              this.state[name] = 1;
              hasAllNamespaces = false;
              if (pending[name] === undefined) pending[name] = true;
              if (toLoad[name] === undefined) toLoad[name] = true;
              if (toLoadNamespaces[ns] === undefined) toLoadNamespaces[ns] = true;
            }
          });
          if (!hasAllNamespaces) toLoadLanguages[lng] = true;
        });
        if (Object.keys(toLoad).length || Object.keys(pending).length) {
          this.queue.push({
            pending,
            pendingCount: Object.keys(pending).length,
            loaded: {},
            errors: [],
            callback
          });
        }
        return {
          toLoad: Object.keys(toLoad),
          pending: Object.keys(pending),
          toLoadLanguages: Object.keys(toLoadLanguages),
          toLoadNamespaces: Object.keys(toLoadNamespaces)
        };
      }
      loaded(name, err, data) {
        const s = name.split('|');
        const lng = s[0];
        const ns = s[1];
        if (err) this.emit('failedLoading', lng, ns, err);
        if (!err && data) {
          this.store.addResourceBundle(lng, ns, data, undefined, undefined, {
            skipCopy: true
          });
        }
        this.state[name] = err ? -1 : 2;
        if (err && data) this.state[name] = 0;
        const loaded = {};
        this.queue.forEach(q => {
          pushPath(q.loaded, [lng], ns);
          removePending(q, name);
          if (err) q.errors.push(err);
          if (q.pendingCount === 0 && !q.done) {
            Object.keys(q.loaded).forEach(l => {
              if (!loaded[l]) loaded[l] = {};
              const loadedKeys = q.loaded[l];
              if (loadedKeys.length) {
                loadedKeys.forEach(n => {
                  if (loaded[l][n] === undefined) loaded[l][n] = true;
                });
              }
            });
            q.done = true;
            if (q.errors.length) {
              q.callback(q.errors);
            } else {
              q.callback();
            }
          }
        });
        this.emit('loaded', loaded);
        this.queue = this.queue.filter(q => !q.done);
      }
      read(lng, ns, fcName, tried = 0, wait = this.retryTimeout, callback) {
        if (!lng.length) return callback(null, {});
        if (this.readingCalls >= this.maxParallelReads) {
          this.waitingReads.push({
            lng,
            ns,
            fcName,
            tried,
            wait,
            callback
          });
          return;
        }
        this.readingCalls++;
        const resolver = (err, data) => {
          this.readingCalls--;
          if (this.waitingReads.length > 0) {
            const next = this.waitingReads.shift();
            this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
          }
          if (err && data && tried < this.maxRetries) {
            setTimeout(() => {
              this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
            }, wait);
            return;
          }
          callback(err, data);
        };
        const fc = this.backend[fcName].bind(this.backend);
        if (fc.length === 2) {
          try {
            const r = fc(lng, ns);
            if (r && typeof r.then === 'function') {
              r.then(data => resolver(null, data)).catch(resolver);
            } else {
              resolver(null, r);
            }
          } catch (err) {
            resolver(err);
          }
          return;
        }
        return fc(lng, ns, resolver);
      }
      prepareLoading(languages, namespaces, options = {}, callback) {
        if (!this.backend) {
          this.logger.warn('No backend was added via i18next.use. Will not load resources.');
          return callback && callback();
        }
        if (isString$1(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
        if (isString$1(namespaces)) namespaces = [namespaces];
        const toLoad = this.queueLoad(languages, namespaces, options, callback);
        if (!toLoad.toLoad.length) {
          if (!toLoad.pending.length) callback();
          return null;
        }
        toLoad.toLoad.forEach(name => {
          this.loadOne(name);
        });
      }
      load(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {}, callback);
      }
      reload(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {
          reload: true
        }, callback);
      }
      loadOne(name, prefix = '') {
        const s = name.split('|');
        const lng = s[0];
        const ns = s[1];
        this.read(lng, ns, 'read', undefined, undefined, (err, data) => {
          if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
          if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
          this.loaded(name, err, data);
        });
      }
      saveMissing(languages, namespace, key, fallbackValue, isUpdate, options = {}, clb = () => {}) {
        if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
          this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
          return;
        }
        if (key === undefined || key === null || key === '') return;
        if (this.backend?.create) {
          const opts = {
            ...options,
            isUpdate
          };
          const fc = this.backend.create.bind(this.backend);
          if (fc.length < 6) {
            try {
              let r;
              if (fc.length === 5) {
                r = fc(languages, namespace, key, fallbackValue, opts);
              } else {
                r = fc(languages, namespace, key, fallbackValue);
              }
              if (r && typeof r.then === 'function') {
                r.then(data => clb(null, data)).catch(clb);
              } else {
                clb(null, r);
              }
            } catch (err) {
              clb(err);
            }
          } else {
            fc(languages, namespace, key, fallbackValue, clb, opts);
          }
        }
        if (!languages || !languages[0]) return;
        this.store.addResource(languages[0], namespace, key, fallbackValue);
      }
    }

    const get = () => ({
      debug: false,
      initAsync: true,
      ns: ['translation'],
      defaultNS: ['translation'],
      fallbackLng: ['dev'],
      fallbackNS: false,
      supportedLngs: false,
      nonExplicitSupportedLngs: false,
      load: 'all',
      preload: false,
      simplifyPluralSuffix: true,
      keySeparator: '.',
      nsSeparator: ':',
      pluralSeparator: '_',
      contextSeparator: '_',
      partialBundledLanguages: false,
      saveMissing: false,
      updateMissing: false,
      saveMissingTo: 'fallback',
      saveMissingPlurals: true,
      missingKeyHandler: false,
      missingInterpolationHandler: false,
      postProcess: false,
      postProcessPassResolved: false,
      returnNull: false,
      returnEmptyString: true,
      returnObjects: false,
      joinArrays: false,
      returnedObjectHandler: false,
      parseMissingKeyHandler: false,
      appendNamespaceToMissingKey: false,
      appendNamespaceToCIMode: false,
      overloadTranslationOptionHandler: args => {
        let ret = {};
        if (typeof args[1] === 'object') ret = args[1];
        if (isString$1(args[1])) ret.defaultValue = args[1];
        if (isString$1(args[2])) ret.tDescription = args[2];
        if (typeof args[2] === 'object' || typeof args[3] === 'object') {
          const options = args[3] || args[2];
          Object.keys(options).forEach(key => {
            ret[key] = options[key];
          });
        }
        return ret;
      },
      interpolation: {
        escapeValue: true,
        format: value => value,
        prefix: '{{',
        suffix: '}}',
        formatSeparator: ',',
        unescapePrefix: '-',
        nestingPrefix: '$t(',
        nestingSuffix: ')',
        nestingOptionsSeparator: ',',
        maxReplaces: 1000,
        skipOnVariables: true
      },
      cacheInBuiltFormats: true
    });
    const transformOptions = options => {
      if (isString$1(options.ns)) options.ns = [options.ns];
      if (isString$1(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
      if (isString$1(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
      if (options.supportedLngs?.indexOf?.('cimode') < 0) {
        options.supportedLngs = options.supportedLngs.concat(['cimode']);
      }
      if (typeof options.initImmediate === 'boolean') options.initAsync = options.initImmediate;
      return options;
    };

    const noop = () => {};
    const bindMemberFunctions = inst => {
      const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
      mems.forEach(mem => {
        if (typeof inst[mem] === 'function') {
          inst[mem] = inst[mem].bind(inst);
        }
      });
    };
    class I18n extends EventEmitter {
      constructor(options = {}, callback) {
        super();
        this.options = transformOptions(options);
        this.services = {};
        this.logger = baseLogger;
        this.modules = {
          external: []
        };
        bindMemberFunctions(this);
        if (callback && !this.isInitialized && !options.isClone) {
          if (!this.options.initAsync) {
            this.init(options, callback);
            return this;
          }
          setTimeout(() => {
            this.init(options, callback);
          }, 0);
        }
      }
      init(options = {}, callback) {
        this.isInitializing = true;
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        if (options.defaultNS == null && options.ns) {
          if (isString$1(options.ns)) {
            options.defaultNS = options.ns;
          } else if (options.ns.indexOf('translation') < 0) {
            options.defaultNS = options.ns[0];
          }
        }
        const defOpts = get();
        this.options = {
          ...defOpts,
          ...this.options,
          ...transformOptions(options)
        };
        this.options.interpolation = {
          ...defOpts.interpolation,
          ...this.options.interpolation
        };
        if (options.keySeparator !== undefined) {
          this.options.userDefinedKeySeparator = options.keySeparator;
        }
        if (options.nsSeparator !== undefined) {
          this.options.userDefinedNsSeparator = options.nsSeparator;
        }
        const createClassOnDemand = ClassOrObject => {
          if (!ClassOrObject) return null;
          if (typeof ClassOrObject === 'function') return new ClassOrObject();
          return ClassOrObject;
        };
        if (!this.options.isClone) {
          if (this.modules.logger) {
            baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
          } else {
            baseLogger.init(null, this.options);
          }
          let formatter;
          if (this.modules.formatter) {
            formatter = this.modules.formatter;
          } else {
            formatter = Formatter;
          }
          const lu = new LanguageUtil(this.options);
          this.store = new ResourceStore(this.options.resources, this.options);
          const s = this.services;
          s.logger = baseLogger;
          s.resourceStore = this.store;
          s.languageUtils = lu;
          s.pluralResolver = new PluralResolver(lu, {
            prepend: this.options.pluralSeparator,
            simplifyPluralSuffix: this.options.simplifyPluralSuffix
          });
          const usingLegacyFormatFunction = this.options.interpolation.format && this.options.interpolation.format !== defOpts.interpolation.format;
          if (usingLegacyFormatFunction) {
            this.logger.deprecate(`init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting`);
          }
          if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
            s.formatter = createClassOnDemand(formatter);
            if (s.formatter.init) s.formatter.init(s, this.options);
            this.options.interpolation.format = s.formatter.format.bind(s.formatter);
          }
          s.interpolator = new Interpolator(this.options);
          s.utils = {
            hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
          };
          s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
          s.backendConnector.on('*', (event, ...args) => {
            this.emit(event, ...args);
          });
          if (this.modules.languageDetector) {
            s.languageDetector = createClassOnDemand(this.modules.languageDetector);
            if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
          }
          if (this.modules.i18nFormat) {
            s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
            if (s.i18nFormat.init) s.i18nFormat.init(this);
          }
          this.translator = new Translator(this.services, this.options);
          this.translator.on('*', (event, ...args) => {
            this.emit(event, ...args);
          });
          this.modules.external.forEach(m => {
            if (m.init) m.init(this);
          });
        }
        this.format = this.options.interpolation.format;
        if (!callback) callback = noop;
        if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
          const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          if (codes.length > 0 && codes[0] !== 'dev') this.options.lng = codes[0];
        }
        if (!this.services.languageDetector && !this.options.lng) {
          this.logger.warn('init: no languageDetector is used and no lng is defined');
        }
        const storeApi = ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
        storeApi.forEach(fcName => {
          this[fcName] = (...args) => this.store[fcName](...args);
        });
        const storeApiChained = ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'];
        storeApiChained.forEach(fcName => {
          this[fcName] = (...args) => {
            this.store[fcName](...args);
            return this;
          };
        });
        const deferred = defer();
        const load = () => {
          const finish = (err, t) => {
            this.isInitializing = false;
            if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn('init: i18next is already initialized. You should call init just once!');
            this.isInitialized = true;
            if (!this.options.isClone) this.logger.log('initialized', this.options);
            this.emit('initialized', this.options);
            deferred.resolve(t);
            callback(err, t);
          };
          if (this.languages && !this.isInitialized) return finish(null, this.t.bind(this));
          this.changeLanguage(this.options.lng, finish);
        };
        if (this.options.resources || !this.options.initAsync) {
          load();
        } else {
          setTimeout(load, 0);
        }
        return deferred;
      }
      loadResources(language, callback = noop) {
        let usedCallback = callback;
        const usedLng = isString$1(language) ? language : this.language;
        if (typeof language === 'function') usedCallback = language;
        if (!this.options.resources || this.options.partialBundledLanguages) {
          if (usedLng?.toLowerCase() === 'cimode' && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
          const toLoad = [];
          const append = lng => {
            if (!lng) return;
            if (lng === 'cimode') return;
            const lngs = this.services.languageUtils.toResolveHierarchy(lng);
            lngs.forEach(l => {
              if (l === 'cimode') return;
              if (toLoad.indexOf(l) < 0) toLoad.push(l);
            });
          };
          if (!usedLng) {
            const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            fallbacks.forEach(l => append(l));
          } else {
            append(usedLng);
          }
          this.options.preload?.forEach?.(l => append(l));
          this.services.backendConnector.load(toLoad, this.options.ns, e => {
            if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
            usedCallback(e);
          });
        } else {
          usedCallback(null);
        }
      }
      reloadResources(lngs, ns, callback) {
        const deferred = defer();
        if (typeof lngs === 'function') {
          callback = lngs;
          lngs = undefined;
        }
        if (typeof ns === 'function') {
          callback = ns;
          ns = undefined;
        }
        if (!lngs) lngs = this.languages;
        if (!ns) ns = this.options.ns;
        if (!callback) callback = noop;
        this.services.backendConnector.reload(lngs, ns, err => {
          deferred.resolve();
          callback(err);
        });
        return deferred;
      }
      use(module) {
        if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
        if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');
        if (module.type === 'backend') {
          this.modules.backend = module;
        }
        if (module.type === 'logger' || module.log && module.warn && module.error) {
          this.modules.logger = module;
        }
        if (module.type === 'languageDetector') {
          this.modules.languageDetector = module;
        }
        if (module.type === 'i18nFormat') {
          this.modules.i18nFormat = module;
        }
        if (module.type === 'postProcessor') {
          postProcessor.addPostProcessor(module);
        }
        if (module.type === 'formatter') {
          this.modules.formatter = module;
        }
        if (module.type === '3rdParty') {
          this.modules.external.push(module);
        }
        return this;
      }
      setResolvedLanguage(l) {
        if (!l || !this.languages) return;
        if (['cimode', 'dev'].indexOf(l) > -1) return;
        for (let li = 0; li < this.languages.length; li++) {
          const lngInLngs = this.languages[li];
          if (['cimode', 'dev'].indexOf(lngInLngs) > -1) continue;
          if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
            this.resolvedLanguage = lngInLngs;
            break;
          }
        }
        if (!this.resolvedLanguage && this.languages.indexOf(l) < 0 && this.store.hasLanguageSomeTranslations(l)) {
          this.resolvedLanguage = l;
          this.languages.unshift(l);
        }
      }
      changeLanguage(lng, callback) {
        this.isLanguageChangingTo = lng;
        const deferred = defer();
        this.emit('languageChanging', lng);
        const setLngProps = l => {
          this.language = l;
          this.languages = this.services.languageUtils.toResolveHierarchy(l);
          this.resolvedLanguage = undefined;
          this.setResolvedLanguage(l);
        };
        const done = (err, l) => {
          if (l) {
            if (this.isLanguageChangingTo === lng) {
              setLngProps(l);
              this.translator.changeLanguage(l);
              this.isLanguageChangingTo = undefined;
              this.emit('languageChanged', l);
              this.logger.log('languageChanged', l);
            }
          } else {
            this.isLanguageChangingTo = undefined;
          }
          deferred.resolve((...args) => this.t(...args));
          if (callback) callback(err, (...args) => this.t(...args));
        };
        const setLng = lngs => {
          if (!lng && !lngs && this.services.languageDetector) lngs = [];
          const fl = isString$1(lngs) ? lngs : lngs && lngs[0];
          const l = this.store.hasLanguageSomeTranslations(fl) ? fl : this.services.languageUtils.getBestMatchFromCodes(isString$1(lngs) ? [lngs] : lngs);
          if (l) {
            if (!this.language) {
              setLngProps(l);
            }
            if (!this.translator.language) this.translator.changeLanguage(l);
            this.services.languageDetector?.cacheUserLanguage?.(l);
          }
          this.loadResources(l, err => {
            done(err, l);
          });
        };
        if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
          setLng(this.services.languageDetector.detect());
        } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
          if (this.services.languageDetector.detect.length === 0) {
            this.services.languageDetector.detect().then(setLng);
          } else {
            this.services.languageDetector.detect(setLng);
          }
        } else {
          setLng(lng);
        }
        return deferred;
      }
      getFixedT(lng, ns, keyPrefix) {
        const fixedT = (key, opts, ...rest) => {
          let o;
          if (typeof opts !== 'object') {
            o = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
          } else {
            o = {
              ...opts
            };
          }
          o.lng = o.lng || fixedT.lng;
          o.lngs = o.lngs || fixedT.lngs;
          o.ns = o.ns || fixedT.ns;
          if (o.keyPrefix !== '') o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
          const keySeparator = this.options.keySeparator || '.';
          let resultKey;
          if (o.keyPrefix && Array.isArray(key)) {
            resultKey = key.map(k => {
              if (typeof k === 'function') k = keysFromSelector(k, {
                ...this.options,
                ...opts
              });
              return `${o.keyPrefix}${keySeparator}${k}`;
            });
          } else {
            if (typeof key === 'function') key = keysFromSelector(key, {
              ...this.options,
              ...opts
            });
            resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
          }
          return this.t(resultKey, o);
        };
        if (isString$1(lng)) {
          fixedT.lng = lng;
        } else {
          fixedT.lngs = lng;
        }
        fixedT.ns = ns;
        fixedT.keyPrefix = keyPrefix;
        return fixedT;
      }
      t(...args) {
        return this.translator?.translate(...args);
      }
      exists(...args) {
        return this.translator?.exists(...args);
      }
      setDefaultNamespace(ns) {
        this.options.defaultNS = ns;
      }
      hasLoadedNamespace(ns, options = {}) {
        if (!this.isInitialized) {
          this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
          return false;
        }
        if (!this.languages || !this.languages.length) {
          this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
          return false;
        }
        const lng = options.lng || this.resolvedLanguage || this.languages[0];
        const fallbackLng = this.options ? this.options.fallbackLng : false;
        const lastLng = this.languages[this.languages.length - 1];
        if (lng.toLowerCase() === 'cimode') return true;
        const loadNotPending = (l, n) => {
          const loadState = this.services.backendConnector.state[`${l}|${n}`];
          return loadState === -1 || loadState === 0 || loadState === 2;
        };
        if (options.precheck) {
          const preResult = options.precheck(this, loadNotPending);
          if (preResult !== undefined) return preResult;
        }
        if (this.hasResourceBundle(lng, ns)) return true;
        if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
        if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
        return false;
      }
      loadNamespaces(ns, callback) {
        const deferred = defer();
        if (!this.options.ns) {
          if (callback) callback();
          return Promise.resolve();
        }
        if (isString$1(ns)) ns = [ns];
        ns.forEach(n => {
          if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
        });
        this.loadResources(err => {
          deferred.resolve();
          if (callback) callback(err);
        });
        return deferred;
      }
      loadLanguages(lngs, callback) {
        const deferred = defer();
        if (isString$1(lngs)) lngs = [lngs];
        const preloaded = this.options.preload || [];
        const newLngs = lngs.filter(lng => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
        if (!newLngs.length) {
          if (callback) callback();
          return Promise.resolve();
        }
        this.options.preload = preloaded.concat(newLngs);
        this.loadResources(err => {
          deferred.resolve();
          if (callback) callback(err);
        });
        return deferred;
      }
      dir(lng) {
        if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
        if (!lng) return 'rtl';
        try {
          const l = new Intl.Locale(lng);
          if (l && l.getTextInfo) {
            const ti = l.getTextInfo();
            if (ti && ti.direction) return ti.direction;
          }
        } catch (e) {}
        const rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam', 'ckb'];
        const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
        if (lng.toLowerCase().indexOf('-latn') > 1) return 'ltr';
        return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf('-arab') > 1 ? 'rtl' : 'ltr';
      }
      static createInstance(options = {}, callback) {
        return new I18n(options, callback);
      }
      cloneInstance(options = {}, callback = noop) {
        const forkResourceStore = options.forkResourceStore;
        if (forkResourceStore) delete options.forkResourceStore;
        const mergedOptions = {
          ...this.options,
          ...options,
          ...{
            isClone: true
          }
        };
        const clone = new I18n(mergedOptions);
        if (options.debug !== undefined || options.prefix !== undefined) {
          clone.logger = clone.logger.clone(options);
        }
        const membersToCopy = ['store', 'services', 'language'];
        membersToCopy.forEach(m => {
          clone[m] = this[m];
        });
        clone.services = {
          ...this.services
        };
        clone.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        if (forkResourceStore) {
          const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
            prev[l] = {
              ...this.store.data[l]
            };
            prev[l] = Object.keys(prev[l]).reduce((acc, n) => {
              acc[n] = {
                ...prev[l][n]
              };
              return acc;
            }, prev[l]);
            return prev;
          }, {});
          clone.store = new ResourceStore(clonedData, mergedOptions);
          clone.services.resourceStore = clone.store;
        }
        clone.translator = new Translator(clone.services, mergedOptions);
        clone.translator.on('*', (event, ...args) => {
          clone.emit(event, ...args);
        });
        clone.init(mergedOptions, callback);
        clone.translator.options = mergedOptions;
        clone.translator.backendConnector.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        return clone;
      }
      toJSON() {
        return {
          options: this.options,
          store: this.store,
          language: this.language,
          languages: this.languages,
          resolvedLanguage: this.resolvedLanguage
        };
      }
    }
    const instance = I18n.createInstance();
    instance.createInstance = I18n.createInstance;

    instance.createInstance;
    instance.dir;
    instance.init;
    instance.loadResources;
    instance.reloadResources;
    instance.use;
    instance.changeLanguage;
    instance.getFixedT;
    instance.t;
    instance.exists;
    instance.setDefaultNamespace;
    instance.hasLoadedNamespace;
    instance.loadNamespaces;
    instance.loadLanguages;

    /*****************************************************************************/
    /************  getLang *******************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} lang 
     * @param {*} flag 
     */
    function getLang(lang, flag) 
    {
        Api.getTranslation(lang)
            .then(res => {
                instance.changeLanguage(lang);
                fillLang(res, lang);
            });

        if (flag)
        {
            localStorage.setItem('language', lang);
            chjs(false);    
            myOnLoad(true);
        }
    }

    /*****************************************************************************/
    /************  fillLang ******************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} transArray 
     * @param {*} lang 
     */
    function fillLang(transArray, lang) 
    {
        $('.trans').each(function(i, obj) 
        {
            let id = $(this).attr('id');
            $(this).text();
            $(this).text(function() {
                let $test1 = transArray[id];
                if ($test1 == undefined) 
                {
                    throw `there is an error with translation for id ${id}. there is no translation available`;
                }
                let $test2 = $test1.replace (/\+/g, " ");
                return $test2;
            });
        });

        $(".form-control").each(function() 
        {
            $(this).popover(
            {
                trigger: 'manual',
                placement: 'bottom',
                html: true,  
            });
        });
        
        langs.forEach(function(l)
        {
            if (lang == l.name)
            {    
                getSecLogTrans(l.name);
                $('.' + l.name).show();     
            
                var flag_en                                           = document.getElementById(l.id_flag);
                flag_en.className                                    += " active";
                $('.form-control').data('bs.popover').options.content = prepareTextFromDB(l.cl_popover_content);
                $(".current").html('<img src="images/' + l.flag_file_name + '" width="34" height="16">');
                //TODOWdocument.getElementById('key_for_edit').placeholder   = lang.key_edit_placeholder;
            }
            else
            {
                $('.' + l.name).hide();
            }
        });

        if ($("#po_on").val() == 'on')
        {
            $('.form-control').popover('show');
        }
        
        localStorage.setItem('language', lang);
    	$("#lang_for_server").val(lang);
        var currentUrl = window.location.href;
        var url = new URL(currentUrl);
    	url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
    }

    let secLogData;
    function getSecLogTrans(lang) 
    {
        $.ajax({
    	    method: 'GET',
            url: '/api/secLogTranslations.php',
            success: res => {
                secLogData = res;
                localStorage.setItem('seclog', JSON.stringify(res));
                secLogTrans(res, lang);
                diagTrans(res, lang);
    	    }
        });
    }

    // doesn't request the data, just read it
    function getSecLogObject$1() {
        return secLogData;
    }

    function fillLangBefore() 
    {
        var langNow = getLangNow();
        langs.forEach(function(lang)
        {
            if (langNow == lang.name)
            {
                document.getElementById('show_pwd').innerHTML         = lang.showPwd;
                $('.popover-content').text(lang.cl_popover_content);
            }
        });
    }
       

    /*****************************************************************************/
    /************  setTextHrefPwd ************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} type 
     */
    function setTextHrefPwd(type) 
    {
        var langNow = getLangNow();
        langs.forEach(function(lang)
        {
            if (langNow == lang.name)
            {
                if (type == 1)
                {
                    document.getElementById('show_pwd').innerHTML = lang.hidePwd;
                }
                else
                {
                    document.getElementById('show_pwd').innerHTML = lang.showPwd; 
                }
            }       
        });
    }


    /*****************************************************************************/
    /************  getLangNow ****************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @returns 
     */
    function getLangNow() 
    {
        var userLang = navigator.language || navigator.userLanguage;
        var langLS = localStorage.getItem('language');
        var langFound = false;
        var retLang = "";

        langs.forEach(function(lang)
        {
            if (lang.name == langLS)
            {
                retLang = lang.name;
                langFound = true;
            } 
        });
        if (langFound == false)
        {
            langs.forEach(function(lang)
            {
                if (userLang.startsWith(lang.name) == true)
                {
                    retLang = lang.name;
                    langFound = true;
                } 
            }); 
        }
        if (langFound)    
        {
            return retLang;
        }
        else              
        {
            return DEFAULT_LANG_NAME;
        }
    }

    /*****************************************************************************/
    /************  prepareTextFromDB *********************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} input 
     * @returns 
     */
    function prepareTextFromDB(input)
    {
        var output = unescape(input);
        output = output.replace(/\+/g, " ");
        output = output.replace(/\&ouml;/g, "ö");
        output = output.replace(/\&auml;/g, "ä");
        output = output.replace(/\&uuml;/g, "ü");
        output = output.replace(/\&Ouml;/g, "Ö");
        output = output.replace(/\&Auml;/g, "Ä");
        output = output.replace(/\&Uuml;/g, "Ü");
        output = output.replace(/\&szlig;/g, "ß");
        output = output.replace(/\&deg;/g, "°");
        output = output.replace(/\&sup2;/g, "²");

        return output;
    }

    function secLogTrans(data, lang)
    {
        for(let log of log_array$1) {
            for(let secLog of $secLogHeader$1) {
                let id = log.id_name + secLog[0];
                if (document.getElementById(id) != null)
                {
                    document.getElementById(id).innerHTML = 
                    data[secLog[0]][lang].abbrev + '<span class="tt-text">' + data[secLog[0]][lang].long + ' ' + secLog[1] + '</span>';
                }
            }
        }
    }

    function diagTrans(data, lang)
    {
        for(let diagram of $diagramList){
            let id = 'DG_' + diagram[0];
            if (document.getElementById(id) != null)
            {
                document.getElementById(id + '_label').innerHTML  = data[diagram[0]][lang].long;
                document.getElementById(id + '_abbrev').innerHTML = data[diagram[0]][lang].abbrev;
                document.getElementById(id + '_unit').innerHTML   = mapUnits[data[diagram[0]].unit][1];
            }
        }
    }

    function start() {
        if (!("ontouchstart" in document.documentElement)) {
            document.documentElement.className += " no-touch";
        }

        $(document).on('click', '.navbar-collapse.in', function (e) {
            if ($(e.target).is('a')) {
                $(this).collapse('hide');
            }
        });

        $("a[href='#top']").click(function () {
            $("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        });

        $(document).ready(function () {

            $('#buttonFunc_submit').click(function (event) {
                event.preventDefault();
                $('#srn_button').val($('#sn').val());
                $('#lang_button').val($('#lang_for_server').val());
                $('#form_button').submit();
                //$("#button_hint").hide();
                //$('#buttonFunc').hide();	
            });

            var inputValue = $('#sn').val();
            var langValue = $('#lang_for_server').val();

            if (inputValue != "") {
                var currentUrl = window.location.href;
                var url = new URL(currentUrl);
                url.searchParams.set('serialnumber', inputValue);
                url.searchParams.set('lang', langValue);

                window.history.replaceState({}, '', url);
            }

            $('.hover-top-container input').on("focus", function () {
                if ($(this).val() === "") {
                    $(this).parents('.hover-top-container').addClass('hover');
                }
            });

            $('.hover-top-container input').on("blur", function () {
                $(this).parents('.hover-top-container').removeClass('hover');
            });

            $('.hover-top-container input').on("input", function () {
                if ($(this).val() === "") {
                    $(this).parents('.hover-top-container').addClass('hover');
                } else {
                    $(this).parents('.hover-top-container').removeClass('hover');
                }
            });
        });
    }

    /* hide the button...*/
    function buttonFuncHide()
    {
        $( '#buttonFunc' ).hide();
        hidePwd();
        $(".js-show-password").val("");
    }

    // TODO: not used?
    function submitButtonBoth()
    {
      $('#buttonFunc_submit').click(function(event) {
        event.preventDefault();
        $('#srn_button').val($('#sn').val());
        $('#buttonFunc_submit').submit();
        $("#button_hint").hide();
        $( '#buttonFunc' ).hide();	
      });
      $("#button_hint").hide();
      $( '#buttonFunc' ).hide();		
    }

    var n$2,l$2,u$3,t$3,i$3,r$3,o$2,e$3,f$3,c$3,s$3,a$3,h$3,p$2={},v$3=[],y$3=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,w$3=Array.isArray;function d$2(n,l){for(var u in l)n[u]=l[u];return n}function g$3(n){n&&n.parentNode&&n.parentNode.removeChild(n);}function _$2(l,u,t){var i,r,o,e={};for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:e[o]=u[o];if(arguments.length>2&&(e.children=arguments.length>3?n$2.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps) void 0===e[o]&&(e[o]=l.defaultProps[o]);return m$1(l,e,i,r,null)}function m$1(n,t,i,r,o){var e={type:n,props:t,key:i,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:null==o?++u$3:o,__i:-1,__u:0};return null==o&&null!=l$2.vnode&&l$2.vnode(e),e}function k$1(n){return n.children}function x$2(n,l){this.props=n,this.context=l;}function S(n,l){if(null==l)return n.__?S(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?S(n):null}function C$1(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return C$1(n)}}function M(n){(!n.__d&&(n.__d=true)&&i$3.push(n)&&!$$1.__r++||r$3!=l$2.debounceRendering)&&((r$3=l$2.debounceRendering)||o$2)($$1);}function $$1(){for(var n,u,t,r,o,f,c,s=1;i$3.length;)i$3.length>s&&i$3.sort(e$3),n=i$3.shift(),s=i$3.length,n.__d&&(t=void 0,r=void 0,o=(r=(u=n).__v).__e,f=[],c=[],u.__P&&((t=d$2({},r)).__v=r.__v+1,l$2.vnode&&l$2.vnode(t),O$1(u.__P,t,r,u.__n,u.__P.namespaceURI,32&r.__u?[o]:null,f,null==o?S(r):o,!!(32&r.__u),c),t.__v=r.__v,t.__.__k[t.__i]=t,N$1(f,t,c),r.__e=r.__=null,t.__e!=o&&C$1(t)));$$1.__r=0;}function I(n,l,u,t,i,r,o,e,f,c,s){var a,h,y,w,d,g,_,m=t&&t.__k||v$3,b=l.length;for(f=P$1(u,l,m,f,b),a=0;a<b;a++)null!=(y=u.__k[a])&&(h=-1==y.__i?p$2:m[y.__i]||p$2,y.__i=a,g=O$1(n,y,h,i,r,o,e,f,c,s),w=y.__e,y.ref&&h.ref!=y.ref&&(h.ref&&B$2(h.ref,null,y),s.push(y.ref,y.__c||w,y)),null==d&&null!=w&&(d=w),(_=!!(4&y.__u))||h.__k===y.__k?f=A$1(y,f,n,_):"function"==typeof y.type&&void 0!==g?f=g:w&&(f=w.nextSibling),y.__u&=-7);return u.__e=d,f}function P$1(n,l,u,t,i){var r,o,e,f,c,s=u.length,a=s,h=0;for(n.__k=new Array(i),r=0;r<i;r++)null!=(o=l[r])&&"boolean"!=typeof o&&"function"!=typeof o?(f=r+h,(o=n.__k[r]="string"==typeof o||"number"==typeof o||"bigint"==typeof o||o.constructor==String?m$1(null,o,null,null,null):w$3(o)?m$1(k$1,{children:o},null,null,null):null==o.constructor&&o.__b>0?m$1(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o).__=n,o.__b=n.__b+1,e=null,-1!=(c=o.__i=L$1(o,u,f,a))&&(a--,(e=u[c])&&(e.__u|=2)),null==e||null==e.__v?(-1==c&&(i>s?h--:i<s&&h++),"function"!=typeof o.type&&(o.__u|=4)):c!=f&&(c==f-1?h--:c==f+1?h++:(c>f?h--:h++,o.__u|=4))):n.__k[r]=null;if(a)for(r=0;r<s;r++)null!=(e=u[r])&&0==(2&e.__u)&&(e.__e==t&&(t=S(e)),D$1(e,e));return t}function A$1(n,l,u,t){var i,r;if("function"==typeof n.type){for(i=n.__k,r=0;i&&r<i.length;r++)i[r]&&(i[r].__=n,l=A$1(i[r],l,u,t));return l}n.__e!=l&&(t&&(l&&n.type&&!l.parentNode&&(l=S(n)),u.insertBefore(n.__e,l||null)),l=n.__e);do{l=l&&l.nextSibling;}while(null!=l&&8==l.nodeType);return l}function H$1(n,l){return l=l||[],null==n||"boolean"==typeof n||(w$3(n)?n.some(function(n){H$1(n,l);}):l.push(n)),l}function L$1(n,l,u,t){var i,r,o,e=n.key,f=n.type,c=l[u],s=null!=c&&0==(2&c.__u);if(null===c&&null==n.key||s&&e==c.key&&f==c.type)return u;if(t>(s?1:0))for(i=u-1,r=u+1;i>=0||r<l.length;)if(null!=(c=l[o=i>=0?i--:r++])&&0==(2&c.__u)&&e==c.key&&f==c.type)return o;return  -1}function T$2(n,l,u){"-"==l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||y$3.test(l)?u:u+"px";}function j$2(n,l,u,t,i){var r,o;n:if("style"==l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||T$2(n.style,l,"");if(u)for(l in u)t&&u[l]==t[l]||T$2(n.style,l,u[l]);}else if("o"==l[0]&&"n"==l[1])r=l!=(l=l.replace(f$3,"$1")),o=l.toLowerCase(),l=o in n||"onFocusOut"==l||"onFocusIn"==l?o.slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?t?u.u=t.u:(u.u=c$3,n.addEventListener(l,r?a$3:s$3,r)):n.removeEventListener(l,r?a$3:s$3,r);else {if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||false===u&&"-"!=l[4]?n.removeAttribute(l):n.setAttribute(l,"popover"==l&&1==u?"":u));}}function F$2(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u.t)u.t=c$3++;else if(u.t<t.u)return;return t(l$2.event?l$2.event(u):u)}}}function O$1(n,u,t,i,r,o,e,f,c,s){var a,h,p,v,y,_,m,b,S,C,M,$,P,A,H,L,T,j=u.type;if(null!=u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),o=[f=u.__e=t.__e]),(a=l$2.__b)&&a(u);n:if("function"==typeof j)try{if(b=u.props,S="prototype"in j&&j.prototype.render,C=(a=j.contextType)&&i[a.__c],M=a?C?C.props.value:a.__:i,t.__c?m=(h=u.__c=t.__c).__=h.__E:(S?u.__c=h=new j(b,M):(u.__c=h=new x$2(b,M),h.constructor=j,h.render=E$2),C&&C.sub(h),h.props=b,h.state||(h.state={}),h.context=M,h.__n=i,p=h.__d=!0,h.__h=[],h._sb=[]),S&&null==h.__s&&(h.__s=h.state),S&&null!=j.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=d$2({},h.__s)),d$2(h.__s,j.getDerivedStateFromProps(b,h.__s))),v=h.props,y=h.state,h.__v=u,p)S&&null==j.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),S&&null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(S&&null==j.getDerivedStateFromProps&&b!==v&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(b,M),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(b,h.__s,M)||u.__v==t.__v){for(u.__v!=t.__v&&(h.props=b,h.state=h.__s,h.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u);}),$=0;$<h._sb.length;$++)h.__h.push(h._sb[$]);h._sb=[],h.__h.length&&e.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(b,h.__s,M),S&&null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(v,y,_);});}if(h.context=M,h.props=b,h.__P=n,h.__e=!1,P=l$2.__r,A=0,S){for(h.state=h.__s,h.__d=!1,P&&P(u),a=h.render(h.props,h.state,h.context),H=0;H<h._sb.length;H++)h.__h.push(h._sb[H]);h._sb=[];}else do{h.__d=!1,P&&P(u),a=h.render(h.props,h.state,h.context),h.state=h.__s;}while(h.__d&&++A<25);h.state=h.__s,null!=h.getChildContext&&(i=d$2(d$2({},i),h.getChildContext())),S&&!p&&null!=h.getSnapshotBeforeUpdate&&(_=h.getSnapshotBeforeUpdate(v,y)),L=a,null!=a&&a.type===k$1&&null==a.key&&(L=V$1(a.props.children)),f=I(n,w$3(L)?L:[L],u,t,i,r,o,e,f,c,s),h.base=u.__e,u.__u&=-161,h.__h.length&&e.push(h),m&&(h.__E=h.__=null);}catch(n){if(u.__v=null,c||null!=o)if(n.then){for(u.__u|=c?160:128;f&&8==f.nodeType&&f.nextSibling;)f=f.nextSibling;o[o.indexOf(f)]=null,u.__e=f;}else {for(T=o.length;T--;)g$3(o[T]);z$1(u);}else u.__e=t.__e,u.__k=t.__k,n.then||z$1(u);l$2.__e(n,u,t);}else null==o&&u.__v==t.__v?(u.__k=t.__k,u.__e=t.__e):f=u.__e=q$3(t.__e,u,t,i,r,o,e,c,s);return (a=l$2.diffed)&&a(u),128&u.__u?void 0:f}function z$1(n){n&&n.__c&&(n.__c.__e=true),n&&n.__k&&n.__k.forEach(z$1);}function N$1(n,u,t){for(var i=0;i<t.length;i++)B$2(t[i],t[++i],t[++i]);l$2.__c&&l$2.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$2.__e(n,u.__v);}});}function V$1(n){return "object"!=typeof n||null==n||n.__b&&n.__b>0?n:w$3(n)?n.map(V$1):d$2({},n)}function q$3(u,t,i,r,o,e,f,c,s){var a,h,v,y,d,_,m,b=i.props,k=t.props,x=t.type;if("svg"==x?o="http://www.w3.org/2000/svg":"math"==x?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),null!=e)for(a=0;a<e.length;a++)if((d=e[a])&&"setAttribute"in d==!!x&&(x?d.localName==x:3==d.nodeType)){u=d,e[a]=null;break}if(null==u){if(null==x)return document.createTextNode(k);u=document.createElementNS(o,x,k.is&&k),c&&(l$2.__m&&l$2.__m(t,e),c=false),e=null;}if(null==x)b===k||c&&u.data==k||(u.data=k);else {if(e=e&&n$2.call(u.childNodes),b=i.props||p$2,!c&&null!=e)for(b={},a=0;a<u.attributes.length;a++)b[(d=u.attributes[a]).name]=d.value;for(a in b)if(d=b[a],"children"==a);else if("dangerouslySetInnerHTML"==a)v=d;else if(!(a in k)){if("value"==a&&"defaultValue"in k||"checked"==a&&"defaultChecked"in k)continue;j$2(u,a,null,d,o);}for(a in k)d=k[a],"children"==a?y=d:"dangerouslySetInnerHTML"==a?h=d:"value"==a?_=d:"checked"==a?m=d:c&&"function"!=typeof d||b[a]===d||j$2(u,a,d,b[a],o);if(h)c||v&&(h.__html==v.__html||h.__html==u.innerHTML)||(u.innerHTML=h.__html),t.__k=[];else if(v&&(u.innerHTML=""),I("template"==t.type?u.content:u,w$3(y)?y:[y],t,i,r,"foreignObject"==x?"http://www.w3.org/1999/xhtml":o,e,f,e?e[0]:i.__k&&S(i,0),c,s),null!=e)for(a=e.length;a--;)g$3(e[a]);c||(a="value","progress"==x&&null==_?u.removeAttribute("value"):null!=_&&(_!==u[a]||"progress"==x&&!_||"option"==x&&_!=b[a])&&j$2(u,a,_,b[a],o),a="checked",null!=m&&m!=u[a]&&j$2(u,a,m,b[a],o));}return u}function B$2(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u));}else n.current=u;}catch(n){l$2.__e(n,t);}}function D$1(n,u,t){var i,r;if(l$2.unmount&&l$2.unmount(n),(i=n.ref)&&(i.current&&i.current!=n.__e||B$2(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount();}catch(n){l$2.__e(n,u);}i.base=i.__P=null;}if(i=n.__k)for(r=0;r<i.length;r++)i[r]&&D$1(i[r],u,t||"function"!=typeof n.type);t||g$3(n.__e),n.__c=n.__=n.__e=void 0;}function E$2(n,l,u){return this.constructor(n,u)}function G$1(u,t,i){var r,o,e,f;t==document&&(t=document.documentElement),l$2.__&&l$2.__(u,t),o=(r="function"=="undefined")?null:t.__k,e=[],f=[],O$1(t,u=(t).__k=_$2(k$1,null,[u]),o||p$2,p$2,t.namespaceURI,o?null:t.firstChild?n$2.call(t.childNodes):null,e,o?o.__e:t.firstChild,r,f),N$1(e,u,f);}function K$1(l,u,t){var i,r,o,e,f=d$2({},l.props);for(o in l.type&&l.type.defaultProps&&(e=l.type.defaultProps),u)"key"==o?i=u[o]:"ref"==o?r=u[o]:f[o]=void 0===u[o]&&null!=e?e[o]:u[o];return arguments.length>2&&(f.children=arguments.length>3?n$2.call(arguments,2):t),m$1(l.type,f,i||l.key,r||l.ref,null)}function Q$1(n){function l(n){var u,t;return this.getChildContext||(u=new Set,(t={})[l.__c]=this,this.getChildContext=function(){return t},this.componentWillUnmount=function(){u=null;},this.shouldComponentUpdate=function(n){this.props.value!=n.value&&u.forEach(function(n){n.__e=true,M(n);});},this.sub=function(n){u.add(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u&&u.delete(n),l&&l.call(n);};}),n.children}return l.__c="__cC"+h$3++,l.__=n,l.Provider=l.__l=(l.Consumer=function(n,l){return n.children(l)}).contextType=l,l}n$2=v$3.slice,l$2={__e:function(n,l,u,t){for(var i,r,o;l=l.__;)if((i=l.__c)&&!i.__)try{if((r=i.constructor)&&null!=r.getDerivedStateFromError&&(i.setState(r.getDerivedStateFromError(n)),o=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),o=i.__d),o)return i.__E=i}catch(l){n=l;}throw n}},u$3=0,t$3=function(n){return null!=n&&null==n.constructor},x$2.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!=this.state?this.__s:this.__s=d$2({},this.state),"function"==typeof n&&(n=n(d$2({},u),this.props)),n&&d$2(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),M(this));},x$2.prototype.forceUpdate=function(n){this.__v&&(this.__e=true,n&&this.__h.push(n),M(this));},x$2.prototype.render=k$1,i$3=[],o$2="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,e$3=function(n,l){return n.__v.__b-l.__v.__b},$$1.__r=0,f$3=/(PointerCapture)$|Capture$/i,c$3=0,s$3=F$2(false),a$3=F$2(true),h$3=0;

    var t$2,r$2,u$2,i$2,o$1=0,f$2=[],c$2=l$2,e$2=c$2.__b,a$2=c$2.__r,v$2=c$2.diffed,l$1=c$2.__c,m=c$2.unmount,s$2=c$2.__;function p$1(n,t){c$2.__h&&c$2.__h(r$2,n,o$1||t),o$1=0;var u=r$2.__H||(r$2.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function d$1(n){return o$1=1,h$2(D,n)}function h$2(n,u,i){var o=p$1(t$2++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):D(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}));}],o.__c=r$2,!r$2.__f)){var f=function(n,t,r){if(!o.__c.__H)return  true;var u=o.__c.__H.__.filter(function(n){return !!n.__c});if(u.every(function(n){return !n.__N}))return !c||c.call(this,n,t,r);var i=o.__c.props!==n;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=true);}}),c&&c.call(this,n,t,r)||i};r$2.__f=true;var c=r$2.shouldComponentUpdate,e=r$2.componentWillUpdate;r$2.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u;}e&&e.call(this,n,t,r);},r$2.shouldComponentUpdate=f;}return o.__N||o.__}function y$2(n,u){var i=p$1(t$2++,3);!c$2.__s&&C(i.__H,u)&&(i.__=n,i.u=u,r$2.__H.__h.push(i));}function A(n){return o$1=5,T$1(function(){return {current:n}},[])}function T$1(n,r){var u=p$1(t$2++,7);return C(u.__H,r)&&(u.__=n(),u.__H=r,u.__h=n),u.__}function q$2(n,t){return o$1=8,T$1(function(){return n},t)}function x$1(n){var u=r$2.context[n.__c],i=p$1(t$2++,9);return i.c=n,u?(null==i.__&&(i.__=true,u.sub(r$2)),u.props.value):n.__}function j$1(){for(var n;n=f$2.shift();)if(n.__P&&n.__H)try{n.__H.__h.forEach(z),n.__H.__h.forEach(B$1),n.__H.__h=[];}catch(t){n.__H.__h=[],c$2.__e(t,n.__v);}}c$2.__b=function(n){r$2=null,e$2&&e$2(n);},c$2.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),s$2&&s$2(n,t);},c$2.__r=function(n){a$2&&a$2(n),t$2=0;var i=(r$2=n.__c).__H;i&&(u$2===r$2?(i.__h=[],r$2.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0;})):(i.__h.forEach(z),i.__h.forEach(B$1),i.__h=[],t$2=0)),u$2=r$2;},c$2.diffed=function(n){v$2&&v$2(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==f$2.push(t)&&i$2===c$2.requestAnimationFrame||((i$2=c$2.requestAnimationFrame)||w$2)(j$1)),t.__H.__.forEach(function(n){n.u&&(n.__H=n.u),n.u=void 0;})),u$2=r$2=null;},c$2.__c=function(n,t){t.some(function(n){try{n.__h.forEach(z),n.__h=n.__h.filter(function(n){return !n.__||B$1(n)});}catch(r){t.some(function(n){n.__h&&(n.__h=[]);}),t=[],c$2.__e(r,n.__v);}}),l$1&&l$1(n,t);},c$2.unmount=function(n){m&&m(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.forEach(function(n){try{z(n);}catch(n){t=n;}}),r.__H=void 0,t&&c$2.__e(t,r.__v));};var k="function"==typeof requestAnimationFrame;function w$2(n){var t,r=function(){clearTimeout(u),k&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,35);k&&(t=requestAnimationFrame(r));}function z(n){var t=r$2,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r$2=t;}function B$1(n){var t=r$2;n.__c=n.__(),r$2=t;}function C(n,t){return !n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function D(n,t){return "function"==typeof t?t(n):t}

    const i$1=Symbol.for("preact-signals");function t$1(){if(r$1>1){r$1--;return}let i,t=false;while(void 0!==s$1){let o=s$1;s$1=void 0;f$1++;while(void 0!==o){const n=o.o;o.o=void 0;o.f&=-3;if(!(8&o.f)&&v$1(o))try{o.c();}catch(o){if(!t){i=o;t=true;}}o=n;}}f$1=0;r$1--;if(t)throw i}function o(i){if(r$1>0)return i();r$1++;try{return i()}finally{t$1();}}let n$1,s$1;function h$1(i){const t=n$1;n$1=void 0;try{return i()}finally{n$1=t;}}let r$1=0,f$1=0,e$1=0;function u$1(i){if(void 0===n$1)return;let t=i.n;if(void 0===t||t.t!==n$1){t={i:0,S:i,p:n$1.s,n:void 0,t:n$1,e:void 0,x:void 0,r:t};if(void 0!==n$1.s)n$1.s.n=t;n$1.s=t;i.n=t;if(32&n$1.f)i.S(t);return t}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=n$1.s;t.n=void 0;n$1.s.n=t;n$1.s=t;}return t}}function c$1(i,t){this.v=i;this.i=0;this.n=void 0;this.t=void 0;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;this.name=null==t?void 0:t.name;}c$1.prototype.brand=i$1;c$1.prototype.h=function(){return  true};c$1.prototype.S=function(i){const t=this.t;if(t!==i&&void 0===i.e){i.x=t;this.t=i;if(void 0!==t)t.e=i;else h$1(()=>{var i;null==(i=this.W)||i.call(this);});}};c$1.prototype.U=function(i){if(void 0!==this.t){const t=i.e,o=i.x;if(void 0!==t){t.x=o;i.e=void 0;}if(void 0!==o){o.e=t;i.x=void 0;}if(i===this.t){this.t=o;if(void 0===o)h$1(()=>{var i;null==(i=this.Z)||i.call(this);});}}};c$1.prototype.subscribe=function(i){return E$1(()=>{const t=this.value,o=n$1;n$1=void 0;try{i(t);}finally{n$1=o;}},{name:"sub"})};c$1.prototype.valueOf=function(){return this.value};c$1.prototype.toString=function(){return this.value+""};c$1.prototype.toJSON=function(){return this.value};c$1.prototype.peek=function(){const i=n$1;n$1=void 0;try{return this.value}finally{n$1=i;}};Object.defineProperty(c$1.prototype,"value",{get(){const i=u$1(this);if(void 0!==i)i.i=this.i;return this.v},set(i){if(i!==this.v){if(f$1>100)throw new Error("Cycle detected");this.v=i;this.i++;e$1++;r$1++;try{for(let i=this.t;void 0!==i;i=i.x)i.t.N();}finally{t$1();}}}});function d(i,t){return new c$1(i,t)}function v$1(i){for(let t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return  true;return  false}function l(i){for(let t=i.s;void 0!==t;t=t.n){const o=t.S.n;if(void 0!==o)t.r=o;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break}}}function y$1(i){let t,o=i.s;while(void 0!==o){const i=o.p;if(-1===o.i){o.S.U(o);if(void 0!==i)i.n=o.n;if(void 0!==o.n)o.n.p=i;}else t=o;o.S.n=o.r;if(void 0!==o.r)o.r=void 0;o=i;}i.s=t;}function a$1(i,t){c$1.call(this,void 0);this.x=i;this.s=void 0;this.g=e$1-1;this.f=4;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;this.name=null==t?void 0:t.name;}a$1.prototype=new c$1;a$1.prototype.h=function(){this.f&=-3;if(1&this.f)return  false;if(32==(36&this.f))return  true;this.f&=-5;if(this.g===e$1)return  true;this.g=e$1;this.f|=1;if(this.i>0&&!v$1(this)){this.f&=-2;return  true}const i=n$1;try{l(this);n$1=this;const i=this.x();if(16&this.f||this.v!==i||0===this.i){this.v=i;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}n$1=i;y$1(this);this.f&=-2;return  true};a$1.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(let i=this.s;void 0!==i;i=i.n)i.S.S(i);}c$1.prototype.S.call(this,i);};a$1.prototype.U=function(i){if(void 0!==this.t){c$1.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(let i=this.s;void 0!==i;i=i.n)i.S.U(i);}}};a$1.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(let i=this.t;void 0!==i;i=i.x)i.t.N();}};Object.defineProperty(a$1.prototype,"value",{get(){if(1&this.f)throw new Error("Cycle detected");const i=u$1(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v}});function w$1(i,t){return new a$1(i,t)}function _$1(i){const o=i.u;i.u=void 0;if("function"==typeof o){r$1++;const s=n$1;n$1=void 0;try{o();}catch(t){i.f&=-2;i.f|=8;b$1(i);throw t}finally{n$1=s;t$1();}}}function b$1(i){for(let t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;_$1(i);}function g$2(i){if(n$1!==this)throw new Error("Out-of-order effect");y$1(this);n$1=i;this.f&=-2;if(8&this.f)b$1(this);t$1();}function p(i,t){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;this.name=null==t?void 0:t.name;}p.prototype.c=function(){const i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;const t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};p.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1;this.f&=-9;_$1(this);l(this);r$1++;const i=n$1;n$1=this;return g$2.bind(this,i)};p.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=s$1;s$1=this;}};p.prototype.d=function(){this.f|=8;if(!(1&this.f))b$1(this);};p.prototype.dispose=function(){this.d();};function E$1(i,t){const o=new p(i,t);try{o.c();}catch(i){o.d();throw i}const n=o.d.bind(o);n[Symbol.dispose]=n;return n}

    let h,w,v=[];E$1(function(){h=this.N;})();function y(i,n){l$2[i]=n.bind(null,l$2[i]||(()=>{}));}function _(i){if(w)w();w=i&&i.S();}function g$1({data:i}){const t=useSignal(i);t.value=i;const[e,f]=T$1(()=>{let i=this,e=this.__v;while(e=e.__)if(e.__c){e.__c.__$f|=4;break}const o=w$1(()=>{let i=t.value.value;return 0===i?0:true===i?"":i||""}),f=w$1(()=>!Array.isArray(o.value)&&!t$3(o.value)),r=E$1(function(){this.N=F$1;if(f.value){const t=o.value;if(i.__v&&i.__v.__e&&3===i.__v.__e.nodeType)i.__v.__e.data=t;}}),u=this.__$u.d;this.__$u.d=function(){r();u.call(this);};return [f,o]},[]);return e.value?f.peek():f.value}g$1.displayName="ReactiveTextNode";Object.defineProperties(c$1.prototype,{constructor:{configurable:true,value:void 0},type:{configurable:true,value:g$1},props:{configurable:true,get(){return {data:this}}},__b:{configurable:true,value:1}});y("__b",(i,t)=>{if("function"==typeof t.type&&"undefined"!=typeof window&&window.__PREACT_SIGNALS_DEVTOOLS__)window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent();if("string"==typeof t.type){let i,n=t.props;for(let e in n){if("children"===e)continue;let o=n[e];if(o instanceof c$1){if(!i)t.__np=i={};i[e]=o;n[e]=o.peek();}}}i(t);});y("__r",(i,t)=>{if("function"==typeof t.type&&"undefined"!=typeof window&&window.__PREACT_SIGNALS_DEVTOOLS__)window.__PREACT_SIGNALS_DEVTOOLS__.enterComponent(t);if(t.type!==k$1){_();let i,n=t.__c;if(n){n.__$f&=-2;i=n.__$u;if(void 0===i)n.__$u=i=function(i){let t;E$1(function(){t=this;});t.c=()=>{n.__$f|=1;n.setState({});};return t}();}_(i);}i(t);});y("__e",(i,t,n,e)=>{if("undefined"!=typeof window&&window.__PREACT_SIGNALS_DEVTOOLS__)window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent();_();i(t,n,e);});y("diffed",(i,t)=>{if("function"==typeof t.type&&"undefined"!=typeof window&&window.__PREACT_SIGNALS_DEVTOOLS__)window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent();_();let n;if("string"==typeof t.type&&(n=t.__e)){let i=t.__np,e=t.props;if(i){let t=n.U;if(t)for(let n in t){let e=t[n];if(void 0!==e&&!(n in i)){e.d();t[n]=void 0;}}else {t={};n.U=t;}for(let o in i){let f=t[o],r=i[o];if(void 0===f){f=b(n,o,r,e);t[o]=f;}else f.o(r,e);}}}i(t);});function b(i,t,n,e){const o=t in i&&void 0===i.ownerSVGElement,f=d(n);return {o:(i,t)=>{f.value=i;e=t;},d:E$1(function(){this.N=F$1;const n=f.value.value;if(e[t]!==n){e[t]=n;if(o)i[t]=n;else if(n)i.setAttribute(t,n);else i.removeAttribute(t);}})}}y("unmount",(i,t)=>{if("string"==typeof t.type){let i=t.__e;if(i){const t=i.U;if(t){i.U=void 0;for(let i in t){let n=t[i];if(n)n.d();}}}}else {let i=t.__c;if(i){const t=i.__$u;if(t){i.__$u=void 0;t.d();}}}i(t);});y("__h",(i,t,n,e)=>{if(e<3||9===e)t.__$f|=2;i(t,n,e);});x$2.prototype.shouldComponentUpdate=function(i,t){const n=this.__$u,e=n&&void 0!==n.s;for(let i in t)return  true;if(this.__f||"boolean"==typeof this.u&&true===this.u){const i=2&this.__$f;if(!(e||i||4&this.__$f))return  true;if(1&this.__$f)return  true}else {if(!(e||4&this.__$f))return  true;if(3&this.__$f)return  true}for(let t in i)if("__source"!==t&&i[t]!==this.props[t])return  true;for(let t in this.props)if(!(t in i))return  true;return  false};function useSignal(i,t){return d$1(()=>d(i,t))[0]}const q$1=i=>{queueMicrotask(()=>{queueMicrotask(i);});};function x(){o(()=>{let i;while(i=v.shift())h.call(i);});}function F$1(){if(1===v.push(this))(l$2.requestAnimationFrame||q$1)(x);}

    const overviewSignal = d();
    // the login dialog should be shown
    const loginSignal = d();
    // error messages from the server
    const serverMessageSignal = d();
    // wether the login is active
    const inputActiveSignal = d();
    const deviceInfoSignal = d();
    const errorSignal = d();

    function correctVersion$1(versionFrBlob) {
        var indexDot = versionFrBlob.indexOf('.');
        var wantSubversion = false;
        var indexUnderscore = versionFrBlob.indexOf('x');
        var length = versionFrBlob.length;
        if (indexUnderscore > 0) {
            var strPoUnderscore = versionFrBlob.substr(indexUnderscore + 1);
            if (strPoUnderscore != '0')
                wantSubversion = true;
            length = indexUnderscore;
        }
        var versionNew;
        if (((length - indexDot) <= 3) && ((length - indexDot) >= 1)) {
            var strDoDot = versionFrBlob.substr(0, indexDot + 1);
            var strPoDot = versionFrBlob.substr(indexDot + 1);
            if (wantSubversion) {
                //versionNew = strDoDot + '0' + strPoDot;

                if ((length - indexDot) == 3) {
                    versionNew = strDoDot + strPoDot;
                }
                else {
                    versionNew = strDoDot + '0' + strPoDot;
                }
                versionNew = versionNew.replace("x", "_");
            }
            else {

                if ((length - indexDot) == 3) {
                    strPoDot = strPoDot.substr(0, 2);
                    versionNew = strDoDot + strPoDot;
                }
                else {
                    strPoDot = strPoDot.substr(0, 1);
                    versionNew = strDoDot + '0' + strPoDot;
                }
            }
            return versionNew;
        }
    }

    function makeHeatRecoveryVisible() {
        document.getElementById("heat_recovery_p").style.display = "block";
        document.getElementById("power_recovery_p").style.display = "block";
        document.getElementById("OV_heat_recovery").style.display = "block";
        document.getElementById("OV_power_recovery").style.display = "block";
    }

    function fillDetails(blobsarray0, sernr) {
        document.getElementById("D_CL_val").innerHTML = (blobsarray0['ComfortLevel']);
        document.getElementById("D_OPH_val").innerHTML = (blobsarray0['operating_hours']);
        document.getElementById("D_FIH_val").innerHTML = (blobsarray0['filter_hours']);
        document.getElementById("D_RA_val").innerHTML = (blobsarray0['RoomArea']);
        document.getElementById("D_2A_val").innerHTML = (blobsarray0['SecondRoomFlow']);
        document.getElementById("D_FSS_val").innerHTML = (blobsarray0['FanSupplyRPM']);
        document.getElementById("D_FSE_val").innerHTML = (blobsarray0['FanExtractRPM']);
        document.getElementById("D_SWV_val").innerHTML = correctVersion$1(blobsarray0['version']);
        document.getElementById("D_CBV_val").innerHTML = (blobsarray0['board_version']);
        document.getElementById("D_SNR_val").innerHTML = (sernr);

        document.getElementById("timestamp").innerHTML = (parseTimestamp(blobsarray0['timestamp'], true));
        setOMdetails(blobsarray0['State'], blobsarray0['ControlAuto'], blobsarray0['DefrostExhaust'], blobsarray0['HumRedMode']);

        if (blobsarray0['bDeicing'] == 1) {
            $('#D_dei_val').attr('checked', 'checked');
        }
    }

    function setProgramCheckbox(ControlAuto, defrostExhaust) {
        if ((defrostExhaust == 1) || (defrostExhaust == 2)) {
            $('#D_dfr_val').attr('checked', 'checked');
        }

        langs.forEach(function (lang) {
            switch (ControlAuto) {
                case 0:
                case "0":
                    $('#D_mve_val').attr('checked', 'checked');
                    return;
                case 1:
                case "1":
                    $('#D_hrr_val').attr('checked', 'checked');
                    return;
                case 2:
                case "2":
                    $('#D_hra_val').attr('checked', 'checked');
                    return;
                case 3:
                case "3":
                    $('#D_col_val').attr('checked', 'checked');
                    return;
                case 4:
                case "4":
                    $('#D_co2_val').attr('checked', 'checked');
                    return;
                case 5:
                case "5":
                    $('#D_win_val').attr('checked', 'checked');
                    return;
                case 6:
                case "6":
                    $('#D_otb_val').attr('checked', 'checked');
                    return;
                case 7:
                case "7":
                    $('#D_hin_val').attr('checked', 'checked');
                    return;
                default:
                    return;
            }
        });
    }

    function setOMdetails(State, ControlAuto, defrostExhaust, humRedMode) {
        langs.forEach(function (lang) {
            switch (State) {
                case 0:
                case "0":
                case 1:
                case "1":    //EAutoStd
                    document.getElementById("D_OM_val_" + lang.name).innerHTML = "Comfort";
                    setProgramCheckbox(ControlAuto, defrostExhaust);
                    break;
                case 2:
                case "2":   //ESleep      
                    document.getElementById("D_OM_val_" + lang.name).innerHTML = "Sleep";
                    break;
                case 3:
                case "3":   //ETurbo       
                    document.getElementById("D_OM_val_" + lang.name).innerHTML = "Turbo";
                    break;
                case 4:
                case "4":   //ETurboCool    
                    document.getElementById("D_OM_val_" + lang.name).innerHTML = "Turbo Cool";
                    break;
                case 5:
                case "5":  //EService       
                    document.getElementById("D_OM_val_" + lang.name).innerHTML = "Service";
                    break;
                case 6:
                case "6":  //ETest     
                    document.getElementById("D_OM_val_" + lang.name).innerHTML = "Test";
                    break;
                case 7:
                case "7":  //EManufacturer     
                    document.getElementById("D_OM_val_" + lang.name).innerHTML = "Manufacturer";
                    break;
            }

            if (humRedMode) {
                document.getElementById("D_OM_val_" + lang.name).innerHTML = lang.om_hum_red_long;
            }
        });
        if ((State == 0) || (State == "0")) {
            State = 1;
        }
        $('input[type="radio"][name="RB_OM"][value="' + State + '"]').prop('checked', true);
    }

    function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function fillErrorText(err) {
        if (err == 22) {
            errorSignal.value = undefined;
            return;
        }
        localStorage.setItem('error', err);

        let getParams = {
            errId: err,
            serialnumber: getSNR(),
            device: 1
        };

        $.ajax({
            method: 'GET',
            data: getParams,
            url: '/api/error.php',
            success: (data) => {
                errorSignal.value = data;
            }
        });
    }

    function noError$1() {
        errorSignal.value = undefined;
    }

    /*****************************************************************************/
    /************  lowPlusHigh ***************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} low 
     * @param {*} high 
     * @param {*} superHigh 
     * @returns 
     */
    function lowPlusHigh(low, high, superHigh) 
    { // á max 7 bit
        var arBitsTotal = [];
        for (var i = 0; i<21;i++) 
        {
            arBitsTotal.push(0);
        }
       
        var LSB7 = byteToBits(low);
        var MSB7;
        //low rein
        for (var i = 0; i<7; i++) 
        {
            arBitsTotal[i] = LSB7[i];
        }
        
        if (superHigh != undefined) { // wenn superHigh vorhanden, dann ist high zahl, nicht array...
            MSB7 = byteToBits(high);
            if (MSB7.length != 8) ; 
           
            for (var i = 0; i<7; i++) 
            {
                arBitsTotal[i+7] = MSB7[i];
            }
            var superHighBit = 0;
            for (var i = 14; i<(superHigh.length+14); i++) 
            {
                arBitsTotal[i] = superHigh[superHighBit];
                superHighBit = superHighBit + 1;
            }
        } 
        else 
        {
            var highBit = 0;
            for (var i = 7; i<(high.length+7); i++) 
            {
                arBitsTotal[i] = high[highBit];
                highBit = highBit + 1;
            }
        }  
        
        var value = 0;
        var potenz = 1;
        for (var i=0; i<20; i++) 
        {
            value = value + (arBitsTotal[i] * potenz);
            potenz = potenz * 2;
        }
        return value;
    }


    /*****************************************************************************/
    /************  divideByte ****************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} division 
     * @param {*} byte 
     * @returns 
     */
    function divideByte(division, byte) 
    {
        var bits = byteToBits(byte);
        
        var dividedByte = [];
        var bit = 0;
        for ( var i = 0; i<division.length; i++) 
        {
            dividedByte[i] =[];
            for (var b = 0; b<division[i]; b++) 
            {
                dividedByte[i].push(bits[bit]);
                bit += 1;
            }
        }
        var checkSumByte = 0;
        for (var i=0; i<division.length; i++) 
        {
            checkSumByte += dividedByte[i].length;
        }
        return dividedByte;
    }


    /*****************************************************************************/
    /************  byteToBits ****************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} byte 
     * @param {*} firstBit 
     * @returns 
     */
    function byteToBits(byte, firstBit) 
    { // if first Bit null, it must be null, if 1, then not important
        var bits = [0,0,0,0,0,0,0,0];
        var potenz = 128;
        for (var i = 7; i>=0; i--) 
        {
            if (byte/potenz >= 1) 
            {
                bits[i] = 1;
                byte = byte - potenz;
            }
            potenz = potenz/2;
        }  
        return bits;
    }


    /*****************************************************************************/
    /************  getNumberFrBits ***********************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} arBits 
     * @param {*} uCount 
     * @returns 
     */
    function getNumberFrBits(arBits, uCount) 
    {
        var potenz = 1;
        var uNumber = 0;
        for (var i=0; i<arBits.length; i++) 
        {
            uNumber += arBits[i] * potenz;
            potenz = potenz * 2;
        }
        return uNumber;
    }


    /*****************************************************************************/
    /************  getPressure ***************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} Pressure5MSB 
     * @param {*} Pressure4LSB 
     * @returns 
     */
    function getPressure (Pressure5MSB, Pressure4LSB) 
    {
        var arBitsTotal = [];
        
        for (var i = 0; i<21;i++) 
        {
            arBitsTotal.push(0);
        }
        
        for (var i = 0; i<4; i++) 
        {
            arBitsTotal[i] = Pressure4LSB[i];
        }
        
        for (var i = 0; i<5; i++) 
        {
            arBitsTotal [i+4] = Pressure5MSB[i];
        }
        
        var value = 0;
        var potenz = 1;
        for (var i=0; i<20; i++) 
        {
            value = value + (arBitsTotal[i] * potenz);
            potenz = potenz * 2;
        }
        return value + 700 //PRES_OFFSET
    }

    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
    	
        decode: function(input) 
        {  
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) 
            {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) 
                {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) 
                {
                    output = output + String.fromCharCode(chr3);
                }
            }
            return output;
        },
    };


    /*****************************************************************************/
    /************* decodeBlobFromAES *********************************************/
    //****************************************************************************/
    /**
     * 
     * @param {*} blob 
     * @param {*} userKey 
     * @returns 
     */
    function decodeBlobFromAES (blob, userKey) 
    {  
        // The initialization vector, which must be 16 bytes    
        var iv = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];
              
        var key_128 = [...aesjs.util.convertStringToBytes(userKey)];
       
        var realLengthKey = key_128.length;
        
        if (realLengthKey > 16) 
        ; 
        else if (realLengthKey < 16) 
        {  //TODO toBeTested
            for (var i=realLengthKey; i<16; i++) 
            {
                key_128[i] = 0x30;
            }
        }
        for (var c=0; c < key_128.length; c++) 
        {
            //key_128[c] = parseInt(key_128[c], 16);
        }
        
        var aesCbc    = new aesjs.ModeOfOperation.cbc(key_128, iv);
        var decrypted = aesCbc.decrypt(blob);
        
        return decrypted;
    }


    /*****************************************************************************/
    /*************** decodeBlobFromAES_256 ***************************************/
    /*****************************************************************************/
    /**
     * 
     * @param {*} blob 
     * @param {*} userKey 
     * @returns 
     */
    function decodeBlobFromAES_256 (blob, userKey)
    {  
        // The initialization vector, which must be 16 bytes    
        var iv = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35];
              
        var key_128 = [...aesjs.util.convertStringToBytes(userKey)];
       
        var realLengthKey = key_128.length;
        
        if (realLengthKey > 32) 
        ; 
        else if (realLengthKey < 32) 
        {  //TODO toBeTested
            for (var i=realLengthKey; i<32; i++) 
            {
                key_128[i] = 0x30;
            }
        }
        for (var c=0; c < key_128.length; c++) 
        {
            //key_128[c] = parseInt(key_128[c], 16);
        }
        
        var aesCbc    = new aesjs.ModeOfOperation.cbc(key_128, iv);
        var decrypted = aesCbc.decrypt(blob);
        
        return decrypted;
    }


    /*****************************************************************************/
    /*************** decodeFromBase64 ********************************************/
    /*****************************************************************************/
    /**
     * 
     * @param {*} blob 
     * @returns 
     */
    function decodeFromBase64$1 (blob) 
    {
        var decodedBlob = Base64.decode(blob);
        return decodedBlob;
    }


    /*****************************************************************************/
    /*************** encodeInBase64 **********************************************/
    /*****************************************************************************/
    /**
     * 
     * @param {*} blob 
     * @returns 
     */
    function encodeInBase64 (blob) 
    {
        var encodedBlob = Base64.encode(blob);
        return encodedBlob;
    }


    /*****************************************************************************/
    /*************** bytesToString ***********************************************/
    /*****************************************************************************/
    /**
     * 
     * @param {*} input 
     * @returns 
     */
    function bytesToString(input) 
    {
        var string = "";
        var i = 0;
        var chr1;
        while (i < input.length) 
        {
            chr1 = String.fromCharCode(input[i++]);
            string = string + chr1;
        }
        return string;
    }


    /*****************************************************************************/
    /*************** stringToBytes ***********************************************/
    /*****************************************************************************/
    /**
     * 
     * @param {*} input 
     * @returns 
     */
    function stringToBytes(input) 
    {
        var bytes = [];
        var i = 0;
        var chr1;
        while (i < input.length) 
        {
            chr1 = input.charCodeAt(i++);
            bytes.push(chr1);
        }
        if (typeof(Buffer) !== 'undefined') {
            return Buffer.from(bytes);
        } else {
            return bytes;
        }
    }

    function parseTimestamp$1(timestamp, primLog) {
        var timestampArray = [];
        var timestampDatum = [];
        var timestampTime = [];
        if (primLog) {
            timestampArray = timestamp.split(' ');
        }
        else {
            timestampArray = timestamp.split('+');
        }
        timestampDatum = timestampArray[0].split('-');
        timestampTime = timestampArray[1].split(':');
        return timestampDatum[2] + '.' + timestampDatum[1] + '.' + timestampDatum[0] + ' ' + timestampTime[0] + ':' + timestampTime[1];
    }
    function parseOneBlob$1(splitblob, userKey, versionCC) {
        var doCrypt256 = checkForCrypt256(versionCC);
        var toBeDecoded = handleSpecialCharactersBack(splitblob);
        var decodedBlobBase64 = decodeFromBase64$1(toBeDecoded);
        //var decodedBlobBase64 = decodeFromBase64(splitblob);
        decodedBlobBase64 = stringToBytes(decodedBlobBase64);
        if (doCrypt256) {
            return decodeBlobFromAES_256(decodedBlobBase64, userKey);
        }
        else {
            return decodeBlobFromAES(decodedBlobBase64, userKey);
        }
    }
    function checkForCrypt256(versionCC) {
        var versionSplit = versionCC.split('x');
        var bCrypt128_a = ((versionSplit[0] == 2) && (versionSplit[1] <= 13));
        var bCrypt128_b = ((versionSplit[0] == 2) && ((versionSplit[1] == 20) || (versionSplit[1] == 21)));
        var bCrypt128 = bCrypt128_a || bCrypt128_b;
        return (!bCrypt128);
    }
    function handleSpecialCharactersBack(withoutSpecialChar) {
        if (withoutSpecialChar.charAt(0) == "\n") {
            withoutSpecialChar = withoutSpecialChar.substring(1);
        }
        var WithSpecialChar = withoutSpecialChar.replace("-", "+");
        WithSpecialChar = WithSpecialChar.replace("_", "/");
        WithSpecialChar = WithSpecialChar.replace(";", "=");
        return WithSpecialChar;
    }
    function parseBlob(blob) {
        let oneBlobAr = blob.split('&');
        for (var x = 0; x < oneBlobAr.length; x++) {
            oneBlobAr[x] = oneBlobAr[x].split('=');
        }
        return oneBlobAr;
    }
    function checkPlausi$1(blob) {
        var thisC = true;
        for (var i = 0; i <= 37; i++) { // TODO zvysit na 38 wegen bDeicing  ggf. se zde jeste da proverit, jestli delka array je 39..
            // TODO wegen pers Counter values noch beides +4.. 
            if ((blob[i] == null) || (blob[i] == undefined)) { // TODO a co ""?
                thisC = false;
            }
        }
        return thisC;
    }

    /*************************************************************/
    /* **********  getSecondRoomFlow *****************************/ 
    /*************************************************************/
    /**
     * transfer the value of the appropriate dip switch value to the second room flow
     * @param {*} dip7 
     * @param {*} dip8 
     * @returns 
     */
    function getSecondRoomFlow(dip7, dip8) 
    { 
        var secRoomFlowCode = 2*dip7 + dip8;
        var secondRoomFlow;
        
        switch(secRoomFlowCode) 
        {
            case 0:            secondRoomFlow = 0;                        break;
            case 1:            secondRoomFlow = 30;                       break;
            case 2:            secondRoomFlow = 60;                       break;
            case 3:            secondRoomFlow = 100;                      break;
            default:           throw "invalid value of second room flow";    }
        
        return secondRoomFlow;
    }


    /*************************************************************/
    /* **********  getRoomArea ***********************************/ 
    /*************************************************************/
    /**
     * transfer the value of the appropriate dip switch value to the room area
     * @param {*} dip2 
     * @param {*} dip3 
     * @param {*} dip4 
     * @returns 
     */
    function getRoomArea(dip2, dip3, dip4) 
    {    
        var roomAreaCode = 4*dip2 + 2*dip3 + dip4;
        var roomArea = 0;
        switch(roomAreaCode)
        {
            case 0:            roomArea = 20;                      break;
            case 1:            roomArea = 25;                      break;
            case 2:            roomArea = 35;                      break;
            case 3:            roomArea = 45;                      break;
            case 4:            roomArea = 60;                      break;
            case 5:            roomArea = 75;                      break;
            case 6:            roomArea = 30;                      break;          // 40 m3/h independant on the room area
            case 7:            roomArea = 50;                      break;          // 60 m3/h independant on the room area
            default:           throw "invalid value of room area";    }    
        return roomArea;   
    }


    /*************************************************************/
    /* **********  getAbsHum *************************************/ 
    /*************************************************************/
    /**
     * get the absolute humidity the same way as the USB Connect does
     * @param {*} relHum 
     * @param {*} temp 
     * @returns 
     */
    function getAbsHum(relHum, temp) 
    { 
        temp = parseFloat(temp);
        var ahPlusG10m3 = [];
        
        ahPlusG10m3[0] = 49;
        ahPlusG10m3[1] = 52;
        ahPlusG10m3[2] = 56;
        ahPlusG10m3[3] = 60;
        ahPlusG10m3[4] = 64;
        ahPlusG10m3[5] = 69;
        ahPlusG10m3[6] = 73;
        ahPlusG10m3[7] = 78;
        ahPlusG10m3[8] = 84;
        ahPlusG10m3[9] = 89;
        ahPlusG10m3[10] = 95;
        ahPlusG10m3[11] = 102;
        ahPlusG10m3[12] = 108;
        ahPlusG10m3[13] = 115;
        ahPlusG10m3[14] = 123;
        ahPlusG10m3[15] = 131;
        ahPlusG10m3[16] = 139;
        ahPlusG10m3[17] = 148;
        ahPlusG10m3[18] = 157;
        ahPlusG10m3[19] = 167;
        ahPlusG10m3[20] = 177;
        ahPlusG10m3[21] = 188;
        ahPlusG10m3[22] = 199;
        ahPlusG10m3[23] = 212;
        ahPlusG10m3[24] = 224;
        ahPlusG10m3[25] = 238;
        ahPlusG10m3[26] = 252;
        ahPlusG10m3[27] = 267;
        ahPlusG10m3[28] = 283;
        ahPlusG10m3[29] = 299;
        ahPlusG10m3[30] = 317;
        ahPlusG10m3[31] = 335;
        ahPlusG10m3[32] = 354;
        ahPlusG10m3[33] = 375;
        ahPlusG10m3[34] = 396;
        ahPlusG10m3[35] = 419;
        ahPlusG10m3[36] = 442;
        ahPlusG10m3[37] = 467;
        ahPlusG10m3[38] = 494;
        ahPlusG10m3[39] = 521;
        ahPlusG10m3[40] = 550;
        ahPlusG10m3[41] = 581;
        ahPlusG10m3[42] = 613;
        ahPlusG10m3[43] = 647;
        ahPlusG10m3[44] = 683;
        ahPlusG10m3[45] = 721;
        ahPlusG10m3[46] = 760;
        ahPlusG10m3[47] = 802;
        ahPlusG10m3[48] = 846;
        ahPlusG10m3[49] = 893;
        ahPlusG10m3[50] = 942;
        
        var ahMinusG10m3 = [];
        
        ahMinusG10m3 [0] = 49; 
        ahMinusG10m3 [1] = 45;
        ahMinusG10m3 [2] = 42;
        ahMinusG10m3 [3] = 39;
        ahMinusG10m3 [4] = 37;
        ahMinusG10m3 [5] = 34;
        ahMinusG10m3 [6] = 32;
        ahMinusG10m3 [7] = 29;
        ahMinusG10m3 [8] = 27;
        ahMinusG10m3 [9] = 25;
        ahMinusG10m3 [10] = 23;
        ahMinusG10m3 [11] = 21;
        ahMinusG10m3 [12] = 20;
        ahMinusG10m3 [13] = 18;
        ahMinusG10m3 [14] = 17;
        ahMinusG10m3 [15] = 15;
        ahMinusG10m3 [16] = 14;
        ahMinusG10m3 [17] = 13;
        ahMinusG10m3 [18] = 12;
        ahMinusG10m3 [19] = 11;
        ahMinusG10m3 [20] = 10;

        var absHum;
        if (temp >= 0) 
        {
            if (temp > 50) 
            {
                absHum = 1000/10 * relHum/100; //absHum = relHum
            } 
            else 
            {
                absHum = ahPlusG10m3[temp]/10 * relHum/100;
            }
        } 
        else 
        {
            temp = Math.abs(temp);
            //if (temp < -20) {
            if (temp > 20) 
            {
                absHum = 5/10 * relHum/100;
            } 
            else 
            {
                absHum = ahMinusG10m3[temp]/10 * relHum/100;
            }
        }
        //!< to one place after comma
        var absHumRounded = absHum.toFixed(1);
        return absHumRounded;
    }


    /*************************************************************/
    /* **********  getAirDensity *********************************/ 
    /*************************************************************/
    /**
     * get air density exact the same way as the USB-Connect
     * @param {*} pressure 
     * @param {*} tempExtract 
     * @returns 
     */
    function getAirDensity(pressure, tempExtract) 
    {
        var density = pressure*100 / ( (tempExtract + 273.15) * 287.058 ) ;
        density = (density + 0.000).toFixed(3);
        return density;
    }


    /*****************************************************************************/
    /************  roundVal ******************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} val1 
     * @returns 
     */
    function roundVal(val1) 
    { 
        return Math.round(val1);
    }


    /*****************************************************************************/
    /************  parseDIP ******************************************************/ 
    /*****************************************************************************/
    /**
     * get 2nd room flow (typ = 1) or room area (typ = 0)
     * @param {*} DIP 
     * @param {*} typ 
     * @returns 
     */
    function parseDIP (DIP, typ) 
    { 
        
        var DIPbits = byteToBits(DIP);
          
        // dip8 ..1, dip7 ..2 ..  (the other way round as described for the customer)
        // sumCool..(5.und 6.)
        // 2ndRoomFlow = dip7 und dip8
        // room area dip2, dip3, dip4
                  
        if (typ == 0) 
        {
            return getRoomArea(DIPbits[6], DIPbits[5], DIPbits[4]);
        } 
        else 
        {
            return getSecondRoomFlow(DIPbits[1], DIPbits[0]);
        }
    }


    /*****************************************************************************/
    /************  parseDIP ******************************************************/ 
    /*****************************************************************************/
    /**
     * check whether the values are plausible
     * @param {*} blob 
     * @returns 
     */
    function checkPlausiPrimBlob$1(blob) 
    {
        var bPlausible = true;
        if ((blob['TempSupply'] < PLAUSI_TEMP_MIN) || (blob['TempSupply'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false;  
        if ((blob['TempOutdoor'] < PLAUSI_TEMP_MIN) || (blob['TempOutdoor'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false;
        if ((blob['TempExhaust'] < PLAUSI_TEMP_MIN) || (blob['TempExhaust'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false;
        if ((blob['TempExtract'] < PLAUSI_TEMP_MIN) || (blob['TempExtract'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false; 
        if ((blob['TempVirtSupExit'] < PLAUSI_TEMP_MIN) || (blob['TempVirtSupExit'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false; 
        if ((blob['HumExtract'] < PLAUSI_HUM_MIN) || (blob['HumExtract'] > PLAUSI_HUM_MAX)) 
            bPlausible = false; 
        if ((blob['HumOutdoor'] < PLAUSI_HUM_MIN) || (blob['HumOutdoor'] > PLAUSI_HUM_MAX)) 
            bPlausible = false; 
        if ((blob['AirFlowAve'] < PLAUSI_AIR_MIN) || (blob['AirFlowAve'] > PLAUSI_AIR_MAX)) 
            bPlausible = false; 
        return bPlausible;
    }


    /*****************************************************************************/
    /************  toSigned ******************************************************/ 
    /*****************************************************************************/    
    /**
     * converts an unsigned number of "potenz" bits to a signed number 
     * @param {*} num 
     * @param {*} potenz 
     * @returns 
     */
    function toSigned(num, potenz) 
    {
        var maxUn = 2;
        for (var i=2; i<=potenz; i++)
        {
            maxUn = maxUn * 2;
        }
        if(num >= (maxUn/2)) {num = num - maxUn;}
        return num;
    }


    /*****************************************************************************/
    /************  correctVersion ************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} versionFrBlob 
     * @returns 
     */
    function correctVersion(versionFrBlob)
    {
        var indexDot = versionFrBlob.indexOf('.');
        var length = versionFrBlob.length;
        if ((length - indexDot) <= 2)
        {
            var strDoDot = versionFrBlob.substr(0,indexDot+1);
            var strPoDot = versionFrBlob.substr(indexDot +1);
            var versionNew = strDoDot + '0' + strPoDot;
            return versionNew;
        }
    }

    function createPrimBlobObject(parsedBlob, timestamp, version, versionFA100) 
    {
        var blobObject = {}; 
        
        var division23 = [6,1];
        var dividedByte23 = divideByte(division23, parsedBlob[23]); 
        
        var division24 = [5,2];
        var dividedByte24 = divideByte(division24, parsedBlob[24]);
        
        var division25 = [5,2];
        var dividedByte25 = divideByte(division25, parsedBlob[25]);
        
        var division26 = [5,2];
        var dividedByte26 = divideByte(division26, parsedBlob[26]);
        
        var division27 = [5,2];
        var dividedByte27 = divideByte(division27, parsedBlob[27]);
        
        var division28 = [5,2];
        var dividedByte28 = divideByte(division28, parsedBlob[28]);
        
        var division29 = [4,3];
        var dividedByte29 = divideByte(division29, parsedBlob[29]);
        
        var division30 = [4,3];
        var dividedByte30 = divideByte(division30, parsedBlob[30]);
        
        var division31 = [4,3];
        var dividedByte31 = divideByte(division31, parsedBlob[31]);
        
        var division32 = [4,3];
        var dividedByte32 = divideByte(division32, parsedBlob[32]);
        
        var division33 = [4,2,1,1];
        var dividedByte33 = divideByte(division33, parsedBlob[33]);
        
        var division34 = [4,1,1,1];
        var dividedByte34 = divideByte(division34, parsedBlob[34]);
        
        var division35 = [5,1,1];
        var dividedByte35 = divideByte(division35, parsedBlob[35]);
        
        var division36 = [5,1,1];
        var dividedByte36 = divideByte(division36, parsedBlob[36]);
        
        var division37 = [5,1,1];
        var dividedByte37 = divideByte(division37, parsedBlob[37]);
        
        var division38 = [4,1,1,1];
        var dividedByte38 = divideByte(division38, parsedBlob[38]);
        
        var division39   = [5,2];
        var dividedByte39 = divideByte(division39, parsedBlob[39]);
        
        var division40    = [4,2,1];
        var dividedByte40 = divideByte(division40, parsedBlob[40]);
        
        var uErrorFileNr = dividedByte23[0];
        var uDeicing     = dividedByte23[1];
        
        var uErrorState     = dividedByte24[0];
        var uDefrostExhaust = dividedByte24[1];
        
        var uVentPosSupply  = dividedByte25[0];
        var uCtrlSetSupVent = dividedByte25[1];
        
        var uVentPosExtract = dividedByte26[0];
        var uCtrlSetExtVent = dividedByte26[1];
        
        var uVentPosBath    = dividedByte27[0];
        var uCtrlSet2ndVent = dividedByte27[1];
        
        var uVentPosBypass  = dividedByte28[0];
        var uCtrlSetBypVent = dividedByte28[1];
        
        var uTempSupplyHigh = dividedByte29[0];
        var uComfortLevel   = dividedByte29[1];
        
        var uTempExtractHigh = dividedByte30[0];
        var uState           = dividedByte30[1];
        
        var uTempExhaustHigh = dividedByte31[0];
        var uControlAuto     = dividedByte31[1];
        
        var uTempOutdoorHigh = dividedByte32[0];
        var uDIP2            = dividedByte32[1];
        
        var uTempVirtSupExitHigh = dividedByte33[0];
        var uNoCO2Sensor      = dividedByte33[2];
        
        var uPressure4LSB     = dividedByte34[0];
        var uCFAHigh          = dividedByte34[1];
        var uFilterSupplyFul  = dividedByte34[2];
        var uFilterExtractFul = dividedByte34[3];
        
        var uAirFlowAve = dividedByte35[0];
        var u2ndRoomOnly20 = dividedByte35[1];
        var uFanLim2ndRoom = dividedByte35[2];
        
        var uFanExtractRPMHigh = dividedByte36[0];
        var uCO2High           = dividedByte36[1];
        var uDIPSwitchHigh     = dividedByte36[2];
        
        var uFanSupplyRPMHigh = dividedByte37[0];
        var uHumRedMode       = dividedByte37[1];
        var uSumCooling       = dividedByte37[2];
        
        var uFanSpeed = dividedByte38[0];
        var uFSCHigh  = dividedByte38[1];
        var uFECHigh  = dividedByte38[2];
        var uCSUHigh  = dividedByte38[3];
        
        var uPressure5MSB         = dividedByte39[0];
        dividedByte39[1];
        
        var uOperatingHoursSuperHigh = dividedByte40[0];
        var uFilterHoursSuperHigh    = dividedByte40[1];
        var uErrorCodeHigh           = dividedByte40[2];
        
        var uTempSupplyLow      = parsedBlob[2];
        var uTempOutdoorLow     = parsedBlob[3];
        var uTempExhaustLow     = parsedBlob[4];
        var uTempExtractLow     = parsedBlob[5];
        var uTempVirtSupExitLow = parsedBlob[6];
        var uFanExtractRPMLow   = parsedBlob[7];
        var uDIPSwitchLow       = parsedBlob[8];
        var uFanSupplyRPMLow    = parsedBlob[9];
        var uErrorLineNrHigh    = parsedBlob[10];
        var uErrorLineNrLow     = parsedBlob[11];
        var uErrorCodeLow       = parsedBlob[12];
        var uCO2Low             = parsedBlob[13];
        var uOperatingHoursLow  = parsedBlob[14];
        var uOperatingHoursHigh = parsedBlob[15];
        var uFilterHoursLow     = parsedBlob[16];
        var uFilterHoursHigh    = parsedBlob[17];
        var uFSCLow             = parsedBlob[18];
        var uFECLow             = parsedBlob[19];
        var uCSULow             = parsedBlob[20];
        var uCFALow             = parsedBlob[21];
    	
    	var uRSSILow  = 0;
    	if (checkForCrypt256(version))
    	{
    		uRSSILow = parsedBlob[43];
    	}
    	else
    	{
    		uRSSILow = parsedBlob[47];
    	}		         
         
        if (timestamp != null)
        blobObject['timestamp'] = timestamp;
        if (version != null)
        blobObject['version'] = version.replace('x', '.');
        if (versionFA100 != null)
        blobObject['versionFA100'] = versionFA100.replace('x', '.');
        
        blobObject['HumOutdoor'] = parsedBlob[0];
        blobObject['HumExtract'] = parsedBlob[1];   
        
        var iTempSupply               = lowPlusHigh(uTempSupplyLow, uTempSupplyHigh/*, undefined*/);
        blobObject['TempSupply']      = toSigned(iTempSupply, 11)/8; 
        var iTempOutdoor              = lowPlusHigh(uTempOutdoorLow, uTempOutdoorHigh/*, undefined*/);
        blobObject['TempOutdoor']     = toSigned(iTempOutdoor, 11)/8; 
        var iTempExhaust              = lowPlusHigh(uTempExhaustLow, uTempExhaustHigh/*, undefined*/);
        blobObject['TempExhaust']     = toSigned(iTempExhaust, 11)/8; 
        var iTempExtract              = lowPlusHigh(uTempExtractLow, uTempExtractHigh/*, undefined*/);
        blobObject['TempExtract']     = toSigned(iTempExtract, 11)/8; 
        var iTempVirtSupExit          = lowPlusHigh(uTempVirtSupExitLow, uTempVirtSupExitHigh/*, undefined*/);
        blobObject['TempVirtSupExit'] = toSigned(iTempVirtSupExit, 11)/8; 
        
        blobObject['CO2']             = lowPlusHigh(uCO2Low, uCO2High/*, undefined*/)*16;
        blobObject['Pressure']        = getPressure (uPressure5MSB, uPressure4LSB);
        blobObject['ComfortLevel']    = getNumberFrBits(uComfortLevel) + 1;
        blobObject['State']           = getNumberFrBits(uState);
        blobObject['HumRedMode']      = getNumberFrBits(uHumRedMode);
        blobObject['FanLim2ndRoom']   = getNumberFrBits(uFanLim2ndRoom);
        blobObject['b2ndRoomOnly20']  = getNumberFrBits(u2ndRoomOnly20);
        blobObject['bSumCooling']     = getNumberFrBits(uSumCooling);
        blobObject['ErrorState']      = getNumberFrBits(uErrorState);
        blobObject['FanSpeed']        = getNumberFrBits(uFanSpeed);
        blobObject['FanSupplyRPM']    = lowPlusHigh(uFanSupplyRPMLow, uFanSupplyRPMHigh/*, undefined*/);
        blobObject['FanExtractRPM']   = lowPlusHigh(uFanExtractRPMLow, uFanExtractRPMHigh/*, undefined*/);
        blobObject['AirFlowAve']      = getNumberFrBits(uAirFlowAve);
        blobObject['FilterSupplyFul'] = getNumberFrBits(uFilterSupplyFul);
        blobObject['FilterExtractFul']= getNumberFrBits(uFilterExtractFul);
        blobObject['VentPosExtract']  = getNumberFrBits(uVentPosExtract);
        blobObject['VentPosBath']     = getNumberFrBits(uVentPosBath);
        blobObject['VentPosSupply']   = getNumberFrBits(uVentPosSupply);
        blobObject['VentPosBypass']   = getNumberFrBits(uVentPosBypass);
        blobObject['ControlAuto']     = getNumberFrBits(uControlAuto);
        blobObject['DIPSwitch']       = lowPlusHigh(uDIPSwitchLow, uDIPSwitchHigh/*, undefined*/);
        blobObject['DIPSwitch2']      = getNumberFrBits(uDIP2);
        blobObject['hasEnthalpyHeatExchanger'] = !!(blobObject['DIPSwitch2'] & 0x4);
        blobObject['DefrostExhaust']  = getNumberFrBits(uDefrostExhaust);
        blobObject['CtrlSetSupVent']  = getNumberFrBits(uCtrlSetSupVent);
        blobObject['CtrlSetExtVent']  = getNumberFrBits(uCtrlSetExtVent);
        blobObject['CtrlSet2ndVent']  = getNumberFrBits(uCtrlSet2ndVent);
        blobObject['CtrlSetBypVent']  = getNumberFrBits(uCtrlSetBypVent);
        blobObject['ErrorFileNr']     = getNumberFrBits(uErrorFileNr);
        blobObject['ErrorLineNr']     = lowPlusHigh(uErrorLineNrLow, uErrorLineNrHigh/*, undefined*/);
        blobObject['ErrorCode']       = lowPlusHigh(uErrorCodeLow, uErrorCodeHigh/*, undefined*/);
        blobObject['NoCO2Sensor']     = getNumberFrBits(uNoCO2Sensor);
        
        //extra values..
        blobObject['filter_hours']    = lowPlusHigh(uFilterHoursLow, uFilterHoursHigh, uFilterHoursSuperHigh);
        blobObject['operating_hours'] = lowPlusHigh(uOperatingHoursLow, uOperatingHoursHigh, uOperatingHoursSuperHigh);
        blobObject['board_version']   = parsedBlob[22];  
        blobObject['bDeicing']        = getNumberFrBits(uDeicing);
        blobObject['FSC']             = lowPlusHigh(uFSCLow, uFSCHigh/*, undefined*/);
        blobObject['FEC']             = lowPlusHigh(uFECLow, uFECHigh/*, undefined*/);
        blobObject['CSU']             = lowPlusHigh(uCSULow, uCSUHigh/*, undefined*/);
        blobObject['CFA']             = lowPlusHigh(uCFALow, uCFAHigh/*,undefined*/);    
        
        blobObject['RoomArea']        = parseDIP(blobObject['DIPSwitch'], 0);
        blobObject['SecondRoomFlow']  = parseDIP(blobObject['DIPSwitch'], 1);
        
        var absHumOutdoor = getAbsHum(blobObject['HumOutdoor'], roundVal(blobObject['TempOutdoor'])); //Temp used as an index
        var absHumExtract = getAbsHum(blobObject['HumExtract'], roundVal(blobObject['TempExtract'])); // Temp used as an index..
        var airDensity    = getAirDensity(blobObject['Pressure'], blobObject['TempExtract']);
        
        blobObject['absHumExtract'] = absHumExtract;
        blobObject['absHumOutdoor'] = absHumOutdoor;
        blobObject['airDensity']    = airDensity;
        blobObject['RSSI']          = toSigned(uRSSILow, 8);
        
        blobObject['S1'] = parsedBlob[41];
        blobObject['S2'] = parsedBlob[42];
        blobObject['S3'] = parsedBlob[43];
        blobObject['S4'] = parsedBlob[44];
        blobObject['S5'] = parsedBlob[45];
        blobObject['S6'] = parsedBlob[46];
        if (blobObject['FanSpeed'] > 2)
        {
            blobObject['AirFlow'] = blobObject['FanSpeed'] * 10;
        } 
        else 
        {
            blobObject['AirFlow'] = blobObject['AirFlowAve'];
        }
        
        return blobObject;
    }

    // this function is deprecated.
    // I created a new values api-endpoint that returns json data.
    function getDataAjax(userKey, SRN_name, SNR) {
        $.ajax({
            method: 'POST',
            url: './getDataHexAjax.php',
            success: function (data) {
                document.getElementById('sn').value = SRN_name;
                try {
                    after(data, userKey, SRN_name, SNR);
                }
                catch (err) {
                    console.log(err);
                    //alert("There was an error when gettint the data.");     
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status);
                //alert(thrownError);         
            }
        });

        getLang(getLangNow(), false);
    }

    function after(data, userKey, SRN_name, SNR) {
        var chartAr = [];
        var decode = decodeURIComponent(data);
        var r = decode.split("timestamp");
        var blobsarray = getObjectArrayPrimLog(userKey, r[PRIM_LOG_PLACE_1], r[PRIM_LOG_PLACE_2], r[PRIM_LOG_PLACE_3], r[PRIM_LOG_PLACE_4]);

        if (blobsarray == null) {
            return;
        }

        if (blobsarray[0] != undefined) {
            overviewSignal.value = blobsarray[0];
            deviceInfoSignal.value = { ...deviceInfoSignal.value, SRN_name };

            let errorState = blobsarray[0]['ErrorState'];
            console.log(errorState);

            if (((errorState == 0) || (errorState == "0"))
                || ((errorState == 22) || (errorState == "22"))) {
                noError();
            }
            else {
                fillErrorText(errorState);
            }

            fillDetails(blobsarray[0], SRN_name);
        }
        else {
            log_array$1.forEach(function (log) {
                prepareForNoSecLog(log, "block", "none", "none");  // no sec logs
            });
            return;
        }

        var count = 0;

        log_array$1.forEach(function (log) {
            // get the array of blob objects for the certain log type
            var blobsArraySecLog = getObjectArraySecLog(userKey, r[log.place_1], r[log.place_2], r[log.place_3], r[log.place_4], log.sec_type, SNR);
            // save the array of blob objects in the global variable 
            if (log.sec_type == 2) {
                blobsArray.Daily = blobsArraySecLog;
                localStorage.setItem('BlobsDaily', blobsArraySecLog);
            }
            else {
                blobsArray.Monthly = blobsArraySecLog;
            }
            chartAr[count] = blobsArraySecLog;
            count = count + 1;
            var decodedTab = decodeFromBase64(r[log.tab_place]);
            fillSecTab(blobsArraySecLog, log, decodedTab); //TODOW we don't need to pass the array, because it is global saved

            if (blobsArraySecLog != null) {
                if ((document.getElementById("table_" + log.name) != undefined) && (document.getElementById("table_" + log.name) != null)) {
                    document.getElementById("table_" + log.name).offsetHeight;
                }
            }

            deleteEmptyTabSpace(log);
        });

        getSecLogTrans(getLangNow());
    }

    function getObjectArrayPrimLog(userKey, blobsLogAjax, timestampsAjax, versionsAjax, versionsFA100Ajax) {
        var blobsarray = [];
        var parsedBlob1 = parseOneBlob(blobsLogAjax, userKey, versionsAjax);
        var objBlob = {};

        if (checkPlausi(parsedBlob1)) {
            objBlob = createPrimBlobObject(parsedBlob1, timestampsAjax, versionsAjax, versionsFA100Ajax);
            if (checkPlausiPrimBlob(objBlob)) {
                blobsarray.push(objBlob);
                //localStorage.setItem('swv_cc', versionsAjax);
                var swv_name = 'swv_cc_' + getSNR();
                localStorage.setItem(swv_name, versionsAjax);
                return blobsarray;
            }
        }
        //false    
        document.getElementById('keyPopup').style.display = "block"; //TODOW -> no Log for this serial number in the last 24 hours

        log_array$1.forEach(function (log) {
            prepareForNoSecLog(log, "none", "none", "block");  //wrong key
            return null;
        });
    }

    /**
     * get array of sec blob objects for a certain log type 
     */
    function getObjectArraySecLog(userKey, blobsLogAjax, timestampsAjax, versionsAjax, versionsFA100Ajax, log_type, SNR) {
        var blobsarray = [];
        var numLogs = 0;
        var numNotPlausiLogs = 0;
        var logg;

        log_array$1.forEach(function (log) {
            if (log_type == log.sec_type) {
                logg = log;
            }
        });

        if ((blobsLogAjax == "NULL") || (blobsLogAjax == undefined)) {
            prepareForNoSecLog(logg, "block", "none", "none");  // no sec logs
            return "NULL";
        }

        // we have logs
        document.getElementById('no_' + logg.name + '_values').style.display = "none";
        document.getElementById(logg.name + '_values').style.display = "block";
        var api1;
        var throttleTimeout = null;
        $('#' + logg.name + '_values').jScrollPane();
        api1 = $('#' + logg.name + '_values').data('jsp');
        reinitScroll(api1, throttleTimeout);
        throttleTimeout = setTimeout(function () {
            api1.reinitialise();
            throttleTimeout = null;
        }, 50);
        $('.table-scroll-horizontal').on('jsp-scroll-x', function (event, scrollPositionX, isAtLeft, isAtRight) {
            $(this).find('.headcol').css({ transform: 'translateX(' + scrollPositionX + 'px)' });
        });

        var blobs = blobsLogAjax.split('&');
        var timestamps = timestampsAjax.split('&');
        var versions = versionsAjax.split('&');
        var versions_main = versionsFA100Ajax.split('&');

        var numSecLogs = 0;

        for (var c = 0; c < blobs.length; c++) {
            var splitblob, splittimestamps, splitversions, splitversionsmain;
            numLogs = numLogs + 1;

            if (blobs[c] != undefined) {
                splitblob = blobs[c].substr(blobs[c].indexOf('=') + 1);
            }
            if (timestamps[c] != undefined) {
                splittimestamps = timestamps[c].substr(timestamps[c].indexOf('=') + 1);
            }
            if (versions[c] != undefined) {
                splitversions = versions[c].substr(versions[c].indexOf('=') + 1);
            }
            if (versions_main[c] != undefined) {
                splitversionsmain = versions_main[c].substr(versions_main[c].indexOf('=') + 1);
            }

            var parsedBlob1 = parseOneBlob(splitblob, userKey, splitversions);
            var thisC = checkPlausi(parsedBlob1);
            var objBlob = {};

            if (thisC == true) {
                objBlob = createSecLogObject(parsedBlob1, splittimestamps, splitversions, splitversionsmain, logg, SNR);
                thisC = checkPlausiSecBlob(objBlob);
            }

            if (thisC == true) { // still true, so push in the array
                blobsarray.push(objBlob);
                numSecLogs++;
            }
            else {
                numNotPlausiLogs = numNotPlausiLogs + 1;
            }
        }

        // save the information how many logs we habe got in the local storage
        localStorage.setItem('num_logs_' + logg.name, numLogs);

        //save the info how many not plausi logs we have got in the local storage
        localStorage.setItem('num_logs_not_plausi_' + logg.name, numNotPlausiLogs);
        if (numSecLogs == 0) {
            prepareForNoSecLog(logg, "none", "block", "none");  // no plausi logs
        }

        return blobsarray;
    }

    /*****************************************************************************/
    /************  getSNR ********************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @returns 
     */
    function getSNR$1() 
    {
        var SNR = $("#srPHP").val();
        if ((SNR == undefined) || (SNR == null) || (SNR == "")) 
        {
            if ((localStorage.getItem('serialnumber') != undefined) && (localStorage.getItem('serialnumber') != null) ) 
            {
                SNR = localStorage.getItem('serialnumber');
                if((localStorage.getItem('serialnumber') != '')) 
                {
    				localStorage.setItem('serialnumber', SNR);    
                    //window.location.href = './tabs.php?sn=' + SNR;
                    return SRN_RELOAD;  
                }
            }
        } 
        if ((SNR == undefined) || (SNR == null) || (SNR == "") ||(SNR == false)) 
        {
            return "";
        } 
        else 
        {
            localStorage.setItem('serialnumber', SNR);      
            return SNR;
        } 
    }


    /*****************************************************************************/
    /************  getSRN_name ***************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} SRN 
     * @returns 
     */
    function getSRN_name(SRN) 
    {
        var SRN_name = $("#srN").val();
        if ((SRN_name === undefined) || (SRN_name === null) /*|| (SRN_name === "") */|| (SRN_name === false)) 
        {
            SRN_name = localStorage.getItem('name' + SRN);  //pouzito?
        }

        if ((SRN_name !== undefined) && (SRN_name !== null) && (SRN_name !== "") && (SRN_name !== false)) 
        {
            return SRN + '-' + SRN_name; 
        } 
        else 
        {
            return SRN;
        }   
    }


    /*****************************************************************************/
    /************  getNameFrSNRname **********************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} SRN_name 
     * @returns 
     */
    function getNameFrSNRname(SRN_name)
    {
        var index = SRN_name.indexOf('-');
        return (index == -1) ? "" : SRN_name.substr(index +1); 
    }


    /*****************************************************************************/
    /************  SerNrInfoHide *************************************************/ 
    /*****************************************************************************/
    /**
     * 
     */
    function SerNrInfoHide()
    {
        document.getElementById('SerNrInfoPopup').style.display = "none";
    }

    function getKeyName(SNR)  
    { 
        return 'key' + SNR;
    }

    /**
     * show the given key in text
     */
    function showPwd() 
    {
        if ($('.js-show-password').attr('type') == 'password') {
            $('.js-show-password').removeAttr("type");
            $('.js-show-password').attr('type', 'text');
            setTextHrefPwd(HIDE);
        } else {
            $('.js-show-password').removeAttr("type");
            $('.js-show-password').attr('type', 'password');
            setTextHrefPwd(SHOW);
        }
    }

    /**
     *  hide the given key in the edit field
     */
    function hidePwd$1()
    {
        $('.js-show-password').removeAttr("type");
        $('.js-show-password').attr('type', 'password');
        setTextHrefPwd(SHOW);
    }

    function clear_key(sernr) 
    {
        localStorage.setItem(getKeyName(sernr), undefined);
    }

    function editKeyPopup() 
    {
        document.getElementById('keyEditPopup').style.display = "block";
    }

    function keyEditHide() 
    {
        $('#keyEditPopup').hide();
        $('#keyPopup').hide();  
        hidePwd$1();
        $(".js-show-password").val("");  
    }

    /*****************************************************************************/
    /************  hideP *********************************************************/ 
    /*****************************************************************************/
    /**
     * 
     */
    function hideP$1() 
    {
        $('.form-control').popover('hide');
        $("#po_on").val("off");  
    }
      

    /*****************************************************************************/
    /************  reinitScroll **************************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} api 
     * @param {*} throttleTimeout 
     */
    function reinitScroll$1(api, throttleTimeout) 
    {
        $(window).on('resize', function () 
        {
            setTimeout(function () 
            {
                api.reinitialise();
            }, 50);
        });
    }


    /*****************************************************************************/
    /************  handlePopup ***************************************************/ 
    /*****************************************************************************/
    /**
     * 
     */
    function handlePopup(doX)
    {
        $('#sn').on('focus', function () 
        {
            if ($(this).val() == '') 
            {
                $(".form-control").popover('show');
                $("#po_on").val("on");
            }
        }); 

        $('#sn').on('keyup', function () 
        {
            if (($(this).val() !== '') ) 
            {
                hideP$1();
                $("#po_on").val("off");
            } 
            else 
            {
                $(".form-control").popover('show');
                $("#po_on").val("on");
            }
        });

        if ($("#sn").val() !== '')  
        {
            hideP$1(); 
        } 
        else if (!doX)
        {
            $(".form-control").popover('show');
            $("#po_on").val("on"); 
        }
    	else
    	{
    		hideP$1();
    	}
    }

    $(document).ready(function() {
        $("#key_edit_popup_button.js-has-info-window").click(function(event) {
            // var fake = "2.20";
            // var version = parseInt(fake.split(".")[1].split("_")[0]); // zobrazi se druhe okno pokud je verze 13 a mene nebo 20 a 21
            // alert(version);

            var version = parseInt($('#D_SWV_val').html().split(".")[1].split("_")[0]); // zobrazi se druhe okno pokud je verze 13 a mene nebo 20 a 21

            if (!(version > 13 && version !== 20 && version !== 21)) {
           //    if (!(version > 13 && version !== 20 && version !== 23)) {
                
                if ($('#form_edit_key')[0].checkValidity()) {
                    event.preventDefault();
                    $('#sw_warning').show();
                    $('#key_edit_popup_button_after_in').click(function(){
                        $('#sw_warning').hide();
                        $('#form_edit_key').submit();
                        keyEditHide();
                    });
                }
            }
        });

    });

    // TODO: this global variable is used at multiple places. getDataFce.js
    const SRN = getSNR$1();

    function getData() {

        log_array$1.forEach(function (log) {
            document.getElementById(log.name + '_values').style.display = "none";
            localStorage.setItem('num_logs_' + log.name, 0);
            localStorage.setItem('num_logs_not_plausi_' + log.name, 0);
        });

        fillLangBefore(); // TODO potrebuji?
        getLang(getLangNow(), false);

        if ((SRN == "") || (SRN == undefined) || (SRN == SRN_RELOAD)) {
            getLang(getLangNow(), false);
            handlePopup(false);
        }
        else {

            localStorage.setItem('serialnumber', SRN);

            var SRN_name = getSRN_name(SRN);
            var LS_name = 'name' + SRN;
            var name = getNameFrSNRname(SRN_name);
            localStorage.setItem(LS_name, name);

            document.getElementById('sn').innerHTML = SRN_name;

            if (SRN) {
                document.getElementById('sn').value = SRN;
                getDataAjax(document.querySelector('[name="srK"]').value, SRN_name, SRN);
                // handlePopup();
            }
        }
    }

    function script() {
        //Serial number
        var SNR = localStorage.getItem("serialnumber");
        if ((SNR == null) || (SNR == undefined) || (SNR == "")) {
            document.getElementById("sn").focus();
        }

        if (localStorage.getItem('serialnumber') != undefined) {
            document.getElementById('SerNrLS').value = localStorage.getItem('serialnumber');
        }

        // hide the key popup with esc - musi byt zde, ne na konce.. 
        $(document).on('keydown', function (e) {
            if (e.keyCode === 27) { // ESC
                $('#keyEditPopup').hide();
                $('#keyPopup').hide();
                $('#buttonDiagInput').hide();
                $('#buttonDiagLogType').hide();
            }
        });


        $('#sn').on('keyup', function () {
            if ($(this).val() !== '') {
                hideP();
            }
            else {
                $(".form-control").popover('show');
                $("#po_on").val("on");
            }
        });

        $('#lang-menu a').on('click', function () {
            var image = $(this).find('img').get(0);
            var imageCopy = $(image).clone();
            var li = $(this).parent('li');

            li.siblings('.active').removeClass('active');
            li.addClass('active');
            $('#lang-menu-toggle').find('.current').html(imageCopy);
        });


        var hash = document.location.hash;

        if (hash) {
            $('.js-nav-tabs a[href="' + hash + '"]').tab('show');
        }

        $('.js-nav-tabs a').on('shown.bs.tab', function (e) {
            $('.js-nav-tabs li.active').removeClass('active');
            window.location.hash = e.target.hash;

        });


        $('#sn').on('focus', function () {
            $(this).select();
        });


        $(document).ready(function () {
            $(function () {
                $('#email_address_1').on('keypress', function (e) {
                    if (e.which == 32) {
                        console.log('Space Detected');
                        return false;
                    }
                });
            });
        });
    }

    function logout() {
    	$(document).ready(function () {
    		//sdata: {serObject:serObject},
    		let srn = $('#sn').val();
    		//var serObject = "serialnumber=" + $srn;
    		$('.js-logout').click(function (event) {

    			let data = srn;
    			event.preventDefault();
    			$.ajax({
    				method: 'POST',
    				data: { data: data },
    				//data: {serObject:serObject},
    				url: '../logout.php',
    				success: function (data) {
    					window.location.href = "/";
    					//alert ("successfully logouted");
    					//return false;
    				},
    				error: function (xhr, ajaxOptions, thrownError) {
    					alert("error in logout");
    					//console.log('Error:', status, error);
    				}
    			});
    			//return false;
    		});
    	});
    }

    /*****************************************************************************/
    /*************** MyScrollBar2 ************************************************/
    /*****************************************************************************/
    /**
     * 
     */
    function MyScrollBar2() 
    {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) 
        {
            var targetTab = $(e.target).attr("href");
            var api;
            var throttleTimeout = null;
            log_array.forEach(function(log)
            {
                if(targetTab === '#' + log.id_tab)
                {
                    $('#' + log.name + '_values').jScrollPane();
                    api = $('#' + log.name + '_values').data('jsp');
                    reinitScroll(api, throttleTimeout);
                }
            });
        });
        $('.table-scroll-horizontal').on('jsp-scroll-x', function (event, scrollPositionX, isAtLeft, isAtRight) 
        {
            $(this).find('.headcol').css({transform: 'translateX(' + scrollPositionX + 'px)'});
        });
    }


    /*****************************************************************************/
    /*************** fillSecTab **************************************************/
    /*****************************************************************************/
    /**
     * 
     * @param {*} blobsarray 
     * @param {*} log 
     * @param {*} $tab 
     */
    function fillSecTab$1(blobsarray, log, $tab) 
    {
        if (blobsarray!= undefined) 
        {      
            for (var $j = 0, len = $secLogHeader.length; $j < len; $j++) 
            {          
                for (var $i = 0; $i<blobsarray.length; $i++) 
                {
                    var $id = log.id_name + $secLogHeader[$j][0] + '_' + $i;
                    if (document.getElementById($id) != null) 
                    {
                        document.getElementById($id).innerHTML = blobsarray[$i][$secLogHeader[$j][0]];  
                    }
                }
            }        
        }       
    }


    /*****************************************************************************/
    /*************** createSecLogObject ******************************************/
    /*****************************************************************************/
    /**
     * create secondary blob object
     * version info for taking into account when parsing, otherwise not used...
     * @param {*} parsedBlobSL 
     * @param {*} timestamp 
     * @param {*} version 
     * @param {*} versionFA100 
     * @param {*} logg 
     * @param {*} SRN 
     * @returns 
     */
    function createSecLogObject$1(parsedBlobSL, timestamp, version, versionFA100, logg, SRN) 
    {
        var blobObject = {}; 
        
        var dividedByte1  = divideByte([6,1  ], parsedBlobSL[1]); 
        var dividedByte2  = divideByte([5,1,1], parsedBlobSL[2]); 
        var dividedByte3  = divideByte([5,1,1], parsedBlobSL[3]); 
        var dividedByte4  = divideByte([5,1,1], parsedBlobSL[4]);
        var dividedByte5  = divideByte([5,1,1], parsedBlobSL[5]); 
        var dividedByte6  = divideByte([5,1,1], parsedBlobSL[6]); 
        var dividedByte7  = divideByte([5,1,1], parsedBlobSL[7]); 
        var dividedByte8  = divideByte([5,1,1], parsedBlobSL[8]); 
        var dividedByte9  = divideByte([5,2,1], parsedBlobSL[9]); 
        var dividedByte10 = divideByte([5,2,1], parsedBlobSL[10]); 
        var dividedByte11 = divideByte([5,2,1], parsedBlobSL[11]); 
        var dividedByte12 = divideByte([5,2,1], parsedBlobSL[12]); 
        var dividedByte13 = divideByte([5,2,1], parsedBlobSL[13]); 
        var dividedByte14 = divideByte([5,2,1], parsedBlobSL[14]); 
        var dividedByte15 = divideByte([5,2,1], parsedBlobSL[15]); 
        var dividedByte16 = divideByte([5,2,1], parsedBlobSL[16]); 
        var dividedByte17 = divideByte([5,2,1], parsedBlobSL[17]); 
        var dividedByte34 = divideByte([4,3  ], parsedBlobSL[34]); 
        var dividedByte36 = divideByte([3,3,1], parsedBlobSL[36]); 
        
        var uErrorFileNr     = dividedByte1[0];
        var uFilterSupplyFul = dividedByte1[1];
        
        var uTimeSupCond      = dividedByte2[0]; // ?? je to water input??
        var uFilterExtractFul = dividedByte2[1];
        var uJustBooted       = dividedByte2[2];
        
        var uTimeHumInp    = dividedByte3[0];
        var uHumRedModeSet = dividedByte3[1];
        var uHumRedModeClr = dividedByte3[2];
        
        var uComLev0     = dividedByte4[0];
        var uSenVal0High = dividedByte4[1];
        var uSenVal1High = dividedByte4[2];
        
        var uComLev1     = dividedByte5[0];
        var uSenVal2High = dividedByte5[1];
        var uSenVal3High = dividedByte5[2];
        
        var uComLev2     = dividedByte6[0];
        var uSenVal4High = dividedByte6[1];
        var uSenVal5High = dividedByte6[2];
        
        var uComLev3       = dividedByte7[0];
        var uSenVal6High   = dividedByte7[1];
        var uErrorCodeHigh = dividedByte7[2];
        
        var uTimeAbsDrying = dividedByte8[0];
        var uPressureHigh  = dividedByte8[1];
        //var uDummy       = division8[2];
        
        var uTimeRelDrying          = dividedByte9[0];
        var uEnergyExtractedSupHigh = dividedByte9[1];
        
        var uTimeCooling            = dividedByte10[0];
        var uEnergyRecoveredSupHigh = dividedByte10[1];
        
        var uTimeCO2Ventilation  = dividedByte11[0];
        var uEnergyCooledSupHigh = dividedByte11[1];
        
        var uTimeSleepMode = dividedByte12[0];
        //var Dummy = division12[1];
        
        var uTimeTurboMode = dividedByte13[0];
        //var Dummy = division13[1];
        
        var uTimeAutoAlt = dividedByte14[0];
        //var Dummy = division14[1];
        
        var uTimeDefExh = dividedByte15[0];
        //var Dummy = division15[1];
        
        var uTimeMinAir = dividedByte16[0];
        //var Dummy = division16[1];
            
        var uErrorState = dividedByte17[0];
        //var Dummy = division17[1];
        
        var uWaterRemovedHigh    = dividedByte34[0];
        dividedByte34[1];   
        var uAirExchangedHigh    = dividedByte36[0];
        var uErrorLineNrHigh     = dividedByte36[1];    
        parsedBlobSL[0];   
        var uSenVal0Low          = parsedBlobSL[18];
        var uSenVal1Low          = parsedBlobSL[19];
        var uSenVal2Low          = parsedBlobSL[20];
        var uSenVal3Low          = parsedBlobSL[21];
        var uSenVal4Low          = parsedBlobSL[22];
        var uSenVal5Low          = parsedBlobSL[23];
        var uSenVal6Low          = parsedBlobSL[24];
        var uErrorCodeLow        = parsedBlobSL[25];
        var uPressureLow         = parsedBlobSL[26];
        var uWaterRemovedLow     = parsedBlobSL[27];
        var uEnergyExtractedLow  = parsedBlobSL[28];
        var uEnergyExtractedHigh = parsedBlobSL[29];
        var uEnergyRecoveredLow  = parsedBlobSL[30];
        var uEnergyRecoveredHigh = parsedBlobSL[31];
        var uEnergyCooledLow     = parsedBlobSL[32];
        var uEnergyCooledHigh    = parsedBlobSL[33];
        var uAirExchangedLow     = parsedBlobSL[35];
        var uErrorLineNrLow      = parsedBlobSL[37];
        var tim                  = timestampForSecLog(parseTimestamp(timestamp, false).toString());
        var dateAr               = tim[0].split('.');   

        blobObject['TIM']        = dateAr[0] + '.' + dateAr[1] + '.' + dateAr[2].substring(2, 4) + '<br>' + tim[1];  
    	blobObject['SWV'] = version.replace('x', '.');
        blobObject['SWV']        = correctVersion(blobObject['SWV']);
        blobObject['RES']        = uJustBooted[0]; 
        blobObject['TET']        = toSigned(lowPlusHigh(uSenVal4Low, uSenVal4High, 0), 8);
        blobObject['HET']        = lowPlusHigh(uSenVal5Low, uSenVal5High, 0);
        blobObject['TOU']        = toSigned(lowPlusHigh(uSenVal1Low, uSenVal1High, 0), 8);
        blobObject['HOU']        = lowPlusHigh(uSenVal2Low, uSenVal2High, 0);
        blobObject['CO2']        = lowPlusHigh(uSenVal6Low, uSenVal6High, 0)*16;
        blobObject['TSU']        = toSigned(lowPlusHigh(uSenVal0Low, uSenVal0High, 0), 8);
        blobObject['TEH']        = toSigned(lowPlusHigh(uSenVal3Low, uSenVal3High, 0), 8);
        blobObject['APR']        = 700 + 2*lowPlusHigh(uPressureLow, uPressureHigh, 0);
        blobObject['ADY']        = getAirDensity(blobObject['APR'], blobObject['TET']);
        blobObject['AEX']        = (logg.aircoef * lowPlusHigh(uAirExchangedLow, getNumberFrBits(uAirExchangedHigh), 0)).toFixed(1); 
        blobObject['SNR']        = SRN;
        blobObject['DL1']        = logg.Tcoef * getNumberFrBits(uComLev0);
        blobObject['DL2']        = logg.Tcoef * getNumberFrBits(uComLev1);
        blobObject['DL3']        = logg.Tcoef * getNumberFrBits(uComLev2);
        blobObject['DL4']        = logg.Tcoef * getNumberFrBits(uComLev3);
        blobObject['DL5']        = connectFormat(logg.DLmax - (blobObject['DL1'] + blobObject['DL2'] + blobObject['DL3'] + blobObject['DL4'])); 
        blobObject['DL1']        = connectFormat(blobObject['DL1']);
        blobObject['DL2']        = connectFormat(blobObject['DL2']);
        blobObject['DL3']        = connectFormat(blobObject['DL3']);
        blobObject['DL4']        = connectFormat(blobObject['DL4']);
        blobObject['DSM']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeSleepMode));
        blobObject['DTM']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeTurboMode));
        blobObject['D1R']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeAutoAlt)); 
        blobObject['DDF']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeDefExh)); 
        blobObject['DMV']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeMinAir));
        blobObject['DWI']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeSupCond)); 
        blobObject['DHI']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeHumInp)); 
        blobObject['DRA']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeAbsDrying));
        blobObject['DRR']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeRelDrying));  
        blobObject['DCO']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeCooling));
        blobObject['DC2']        = connectFormat(logg.Tcoef * getNumberFrBits(uTimeCO2Ventilation));
        blobObject['HRU']        = uHumRedModeSet[0];
        blobObject['HRN']        = uHumRedModeClr[0];
        blobObject['EXE']        = countEne(logg.enecoef, uEnergyExtractedLow, uEnergyExtractedHigh, uEnergyExtractedSupHigh);
        blobObject['REE']        = countEne(logg.enecoef, uEnergyRecoveredLow, uEnergyRecoveredHigh, uEnergyRecoveredSupHigh);
        var var1 = blobObject['AEX'] / logg.opho;
        var resHRP =  ((blobObject['EXE'] > 0) && (blobObject['REE'] > 0)) ? (blobObject['REE'] / blobObject['EXE'] * 100) : 0;  //TODO (:)
        var res    = (var1 < 51) ? (var1*0.13 + 1) : (var1*0.49 - 17);
        
        blobObject['HRP']       = resHRP.toFixed(0);
        blobObject['PCO']       = (res*logg.opho).toFixed(1); 
        blobObject['COE']       = countEne(logg.enecoef, uEnergyCooledLow, uEnergyCooledHigh, uEnergyCooledSupHigh);

        blobObject['WAR']       = toSigned((lowPlusHigh(uWaterRemovedLow, uWaterRemovedHigh,undefined)), 11);
        blobObject['WAR']       = blobObject['WAR'] * logg.watercoef;
        blobObject['ES']        = getNumberFrBits(uErrorState);
        blobObject['EFN']       = getNumberFrBits(uErrorFileNr);
        blobObject['ELN']       = lowPlusHigh(uErrorLineNrLow, uErrorLineNrHigh, 0);
        blobObject['ECO']       = lowPlusHigh(uErrorCodeLow, uErrorCodeHigh, 0);
        blobObject['FSF']       = uFilterSupplyFul[0];
        blobObject['FEF']       = uFilterExtractFul[0];
        blobObject['S21']       = parsedBlobSL[38];
        blobObject['S22']       = parsedBlobSL[39];
        blobObject['S23']       = parsedBlobSL[40];
        blobObject['S24']       = parsedBlobSL[41];
        blobObject['S25']       = parsedBlobSL[42];
        blobObject['S26']       = parsedBlobSL[43];
        blobObject['S27']       = parsedBlobSL[44];
        blobObject['S28']       = parsedBlobSL[45];
        blobObject['S29']       = parsedBlobSL[46];
        blobObject['S30']       = parsedBlobSL[47];
        return blobObject;
    }


    /*****************************************************************************/
    /*************** connectFormat ***********************************************/
    /*****************************************************************************/
    /**
     * 
     * @param {*} value 
     * @returns 
     */
    function connectFormat(value)
    {
        return (value==0)?'-':value.toString().concat(":00");
    }


    /*****************************************************************************/
    /*************** countEne ****************************************************/
    /*****************************************************************************/
    /**
     * 
     * @param {*} coef 
     * @param {*} uLow 
     * @param {*} uHigh 
     * @param {*} uSupHigh 
     * @returns 
     */
    function countEne(coef, uLow, uHigh, uSupHigh)
    {
        var uEne = toSigned(lowPlusHigh(uLow, uHigh, uSupHigh), 16);
        uEne = (uEne * coef / 2.79).toFixed(1);
        return uEne;
    }

    /*****************************************************************************/
    /************  checkPlausiSecBlob ********************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} blob 
     * @returns 
     */
    function checkPlausiSecBlob$1(blob) 
    {
        var bPlausible = true;
        if ((blob['TET'] < PLAUSI_TEMP_MIN) || (blob['TET'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false;  
        if ((blob['TOU'] < PLAUSI_TEMP_MIN) || (blob['TOU'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false;
        if ((blob['TSU'] < PLAUSI_TEMP_MIN) || (blob['TSU'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false;
        if ((blob['TEH'] < PLAUSI_TEMP_MIN) || (blob['TEH'] > PLAUSI_TEMP_MAX)) 
            bPlausible = false; 
        if ((blob['HET'] < PLAUSI_HUM_MIN)  || (blob['HET'] > PLAUSI_HUM_MAX)) 
            bPlausible = false; 
        if ((blob['HOU'] < PLAUSI_HUM_MIN)  || (blob['HOU'] > PLAUSI_HUM_MAX)) 
            bPlausible = false; 
        if ((blob['HRP'] < PLAUSI_WRP_MIN)  || (blob['HRP'] > PLAUSI_WRP_MAX)) 
            bPlausible = false; 
        
        if (getSNR() == 36)
        {
            return true;
        }
        else
        {
            return bPlausible;
        }
    }


    /*****************************************************************************/
    /************  timestampForSecLog ********************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} timestamp 
     * @returns 
     */
    function timestampForSecLog$1(timestamp) 
    {
        var TS = timestamp.split(" ");
        return TS; 
    }


    /*****************************************************************************/
    /************  prepareForNoSecLog ********************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} log 
     * @param {*} nolog 
     * @param {*} noplausi 
     * @param {*} wrongkey 
     */
    function prepareForNoSecLog$1(log, nolog, noplausi, wrongkey)
    {
        document.getElementById('no_' + log.name + '_values').style.display = "block";
        document.getElementById(log.name + '_values').style.display = "none";
        $('#div_' + log.name + '_values').addClass("flex-column-secTab");

        document.getElementById('no_' + log.name + '_val_text').style.display = nolog;
        document.getElementById('no_' + log.name + '_plausi_logs_text').style.display = noplausi;
        document.getElementById('wrong_key_' + log.name + '_text').style.display = wrongkey;
    }


    /*****************************************************************************/
    /************  deleteEmptyTabSpace *******************************************/ 
    /*****************************************************************************/
    /**
     * 
     * @param {*} log 
     */
    function deleteEmptyTabSpace$1(log) 
    {
        var numLogs = localStorage.getItem('num_logs_' + log.name);
        var numNotPlausiLogs = localStorage.getItem('num_logs_not_plausi_' + log.name); 
        var firstToDelete = numLogs - numNotPlausiLogs;

        for (var i = firstToDelete; i < numLogs; i++) 
        {
            var className = log.classletter;
            className = className.concat(i.toString());
            var all = document.getElementsByClassName(className);
            for (var j = 0; j < all.length; j++) 
            {
                all[j].style.display = "none";
            }
        }
    }

    var f=0;function u(e,t,n,o,i,u){t||(t={});var a,c,p=t;if("ref"in p)for(c in p={},t)"ref"==c?a=t[c]:p[c]=t[c];var l={type:e,props:p,key:n,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--f,__i:-1,__u:0,__source:i,__self:u};if("function"==typeof e&&(a=e.defaultProps))for(c in a) void 0===p[c]&&(p[c]=a[c]);return l$2.vnode&&l$2.vnode(l),l}

    function g(n,t){for(var e in t)n[e]=t[e];return n}function E(n,t){for(var e in n)if("__source"!==e&&!(e in t))return  true;for(var r in t)if("__source"!==r&&n[r]!==t[r])return  true;return  false}function N(n,t){this.props=n,this.context=t;}(N.prototype=new x$2).isPureReactComponent=true,N.prototype.shouldComponentUpdate=function(n,t){return E(this.props,n)||E(this.state,t)};var T=l$2.__b;l$2.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),T&&T(n);};var L=function(n,t){return null==n?null:H$1(H$1(n).map(t))},O={map:L,forEach:L,count:function(n){return n?H$1(n).length:0},only:function(n){var t=H$1(n);if(1!==t.length)throw "Children.only";return t[0]},toArray:H$1},F=l$2.__e;l$2.__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),u.__c(n,t);F(n,t,e,r);};var U=l$2.unmount;function V(n,t,e){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c();}),n.__c.__H=null),null!=(n=g({},n)).__c&&(n.__c.__P===e&&(n.__c.__P=t),n.__c.__e=true,n.__c=null),n.__k=n.__k&&n.__k.map(function(n){return V(n,t,e)})),n}function W(n,t,e){return n&&e&&(n.__v=null,n.__k=n.__k&&n.__k.map(function(n){return W(n,t,e)}),n.__c&&n.__c.__P===t&&(n.__e&&e.appendChild(n.__e),n.__c.__e=true,n.__c.__P=e)),n}function P(){this.__u=0,this.o=null,this.__b=null;}function j(n){var t=n.__.__c;return t&&t.__a&&t.__a(n)}function B(){this.i=null,this.l=null;}l$2.unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&32&n.__u&&(n.type=null),U&&U(n);},(P.prototype=new x$2).__c=function(n,t){var e=t.__c,r=this;null==r.o&&(r.o=[]),r.o.push(e);var u=j(r.__v),o=false,i=function(){o||(o=true,e.__R=null,u?u(l):l());};e.__R=i;var l=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=W(n,n.__c.__P,n.__c.__O);}var t;for(r.setState({__a:r.__b=null});t=r.o.pop();)t.forceUpdate();}};r.__u++||32&t.__u||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i);},P.prototype.componentWillUnmount=function(){this.o=[];},P.prototype.render=function(n,e){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),o=this.__v.__k[0].__c;this.__v.__k[0]=V(this.__b,r,o.__O=o.__P);}this.__b=null;}var i=e.__a&&_$2(k$1,null,n.fallback);return i&&(i.__u&=-33),[_$2(k$1,null,e.__a?null:n.children),i]};var H=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(B.prototype=new x$2).__a=function(n){var t=this,e=j(t.__v),r=t.l.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),H(t,n,r)):u();};e?e(o):o();}},B.prototype.render=function(n){this.i=null,this.l=new Map;var t=H$1(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},B.prototype.componentDidUpdate=B.prototype.componentDidMount=function(){var n=this;this.l.forEach(function(t,e){H(n,e,t);});};var q="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,G=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,J=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,K=/[A-Z0-9]/g,Q="undefined"!=typeof document,X=function(n){return ("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/:/fil|che|ra/).test(n)};x$2.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(x$2.prototype,t,{configurable:true,get:function(){return this["UNSAFE_"+t]},set:function(n){Object.defineProperty(this,t,{configurable:true,writable:true,value:n});}});});var en$1=l$2.event;function rn(){}function un(){return this.cancelBubble}function on(){return this.defaultPrevented}l$2.event=function(n){return en$1&&(n=en$1(n)),n.persist=rn,n.isPropagationStopped=un,n.isDefaultPrevented=on,n.nativeEvent=n};var cn={enumerable:false,configurable:true,get:function(){return this.class}},fn=l$2.vnode;l$2.vnode=function(n){"string"==typeof n.type&&function(n){var t=n.props,e=n.type,u={},o=-1===e.indexOf("-");for(var i in t){var l=t[i];if(!("value"===i&&"defaultValue"in t&&null==l||Q&&"children"===i&&"noscript"===e||"class"===i||"className"===i)){var c=i.toLowerCase();"defaultValue"===i&&"value"in t&&null==t.value?i="value":"download"===i&&true===l?l="":"translate"===c&&"no"===l?l=false:"o"===c[0]&&"n"===c[1]?"ondoubleclick"===c?i="ondblclick":"onchange"!==c||"input"!==e&&"textarea"!==e||X(t.type)?"onfocus"===c?i="onfocusin":"onblur"===c?i="onfocusout":J.test(i)&&(i=c):c=i="oninput":o&&G.test(i)?i=i.replace(K,"-$&").toLowerCase():null===l&&(l=void 0),"oninput"===c&&u[i=c]&&(i="oninputCapture"),u[i]=l;}}"select"==e&&u.multiple&&Array.isArray(u.value)&&(u.value=H$1(t.children).forEach(function(n){n.props.selected=-1!=u.value.indexOf(n.props.value);})),"select"==e&&null!=u.defaultValue&&(u.value=H$1(t.children).forEach(function(n){n.props.selected=u.multiple?-1!=u.defaultValue.indexOf(n.props.value):u.defaultValue==n.props.value;})),t.class&&!t.className?(u.class=t.class,Object.defineProperty(u,"className",cn)):(t.className&&!t.class||t.class&&t.className)&&(u.class=u.className=t.className),n.props=u;}(n),n.$$typeof=q,fn&&fn(n);};var an=l$2.__r;l$2.__r=function(n){an&&an(n),n.__c;};var sn=l$2.diffed;l$2.diffed=function(n){sn&&sn(n);var t=n.props,e=n.__e;null!=e&&"textarea"===n.type&&"value"in t&&t.value!==e.value&&(e.value=null==t.value?"":t.value);};function mn(n){return !!n&&n.$$typeof===q}function _n(n){return mn(n)?K$1.apply(null,arguments):n}

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    /**
     * This file automatically generated from `pre-publish.js`.
     * Do not manually edit.
     */

    var voidElements;
    var hasRequiredVoidElements;

    function requireVoidElements () {
    	if (hasRequiredVoidElements) return voidElements;
    	hasRequiredVoidElements = 1;
    	voidElements = {
    	  "area": true,
    	  "base": true,
    	  "br": true,
    	  "col": true,
    	  "embed": true,
    	  "hr": true,
    	  "img": true,
    	  "input": true,
    	  "link": true,
    	  "meta": true,
    	  "param": true,
    	  "source": true,
    	  "track": true,
    	  "wbr": true
    	};
    	return voidElements;
    }

    var voidElementsExports = requireVoidElements();
    const e = /*@__PURE__*/getDefaultExportFromCjs(voidElementsExports);

    var t=/\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g;function n(n){var r={type:"tag",name:"",voidElement:false,attrs:{},children:[]},i=n.match(/<\/?([^\s]+?)[/\s>]/);if(i&&(r.name=i[1],(e[i[1]]||"/"===n.charAt(n.length-2))&&(r.voidElement=true),r.name.startsWith("!--"))){var s=n.indexOf("--\x3e");return {type:"comment",comment:-1!==s?n.slice(4,s):""}}for(var a=new RegExp(t),c=null;null!==(c=a.exec(n));)if(c[0].trim())if(c[1]){var o=c[1].trim(),l=[o,""];o.indexOf("=")>-1&&(l=o.split("=")),r.attrs[l[0]]=l[1],a.lastIndex--;}else c[2]&&(r.attrs[c[2]]=c[3].trim().substring(1,c[3].length-1));return r}var r=/<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g,i=/^\s*$/,s=Object.create(null);function a(e,t){switch(t.type){case "text":return e+t.content;case "tag":return e+="<"+t.name+(t.attrs?function(e){var t=[];for(var n in e)t.push(n+'="'+e[n]+'"');return t.length?" "+t.join(" "):""}(t.attrs):"")+(t.voidElement?"/>":">"),t.voidElement?e:e+t.children.reduce(a,"")+"</"+t.name+">";case "comment":return e+"\x3c!--"+t.comment+"--\x3e"}}var c={parse:function(e,t){t||(t={}),t.components||(t.components=s);var a,c=[],o=[],l=-1,m=false;if(0!==e.indexOf("<")){var u=e.indexOf("<");c.push({type:"text",content:-1===u?e:e.substring(0,u)});}return e.replace(r,function(r,s){if(m){if(r!=="</"+a.name+">")return;m=false;}var u,f="/"!==r.charAt(1),h=r.startsWith("\x3c!--"),p=s+r.length,d=e.charAt(p);if(h){var v=n(r);return l<0?(c.push(v),c):((u=o[l]).children.push(v),c)}if(f&&(l++,"tag"===(a=n(r)).type&&t.components[a.name]&&(a.type="component",m=true),a.voidElement||m||!d||"<"===d||a.children.push({type:"text",content:e.slice(p,e.indexOf("<",p))}),0===l&&c.push(a),(u=o[l-1])&&u.children.push(a),o[l]=a),(!f||a.voidElement)&&(l>-1&&(a.voidElement||a.name===r.slice(2,-1))&&(l--,a=-1===l?c:o[l]),!m&&"<"!==d&&d)){u=-1===l?c:o[l].children;var x=e.indexOf("<",p),g=e.slice(p,-1===x?void 0:x);i.test(g)&&(g=" "),(x>-1&&l+u.length>=0||" "!==g)&&u.push({type:"text",content:g});}}),c},stringify:function(e){return e.reduce(function(e,t){return e+a("",t)},"")}};

    const warn = (i18n, code, msg, rest) => {
      const args = [msg, {
        code,
        ...(rest || {})
      }];
      if (i18n?.services?.logger?.forward) {
        return i18n.services.logger.forward(args, 'warn', 'react-i18next::', true);
      }
      if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
      if (i18n?.services?.logger?.warn) {
        i18n.services.logger.warn(...args);
      } else if (console?.warn) {
        console.warn(...args);
      }
    };
    const alreadyWarned = {};
    const warnOnce = (i18n, code, msg, rest) => {
      if (isString(msg) && alreadyWarned[msg]) return;
      if (isString(msg)) alreadyWarned[msg] = new Date();
      warn(i18n, code, msg, rest);
    };
    const loadedClb = (i18n, cb) => () => {
      if (i18n.isInitialized) {
        cb();
      } else {
        const initialized = () => {
          setTimeout(() => {
            i18n.off('initialized', initialized);
          }, 0);
          cb();
        };
        i18n.on('initialized', initialized);
      }
    };
    const loadNamespaces = (i18n, ns, cb) => {
      i18n.loadNamespaces(ns, loadedClb(i18n, cb));
    };
    const loadLanguages = (i18n, lng, ns, cb) => {
      if (isString(ns)) ns = [ns];
      if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb);
      ns.forEach(n => {
        if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
      });
      i18n.loadLanguages(lng, loadedClb(i18n, cb));
    };
    const hasLoadedNamespace = (ns, i18n, options = {}) => {
      if (!i18n.languages || !i18n.languages.length) {
        warnOnce(i18n, 'NO_LANGUAGES', 'i18n.languages were undefined or empty', {
          languages: i18n.languages
        });
        return true;
      }
      return i18n.hasLoadedNamespace(ns, {
        lng: options.lng,
        precheck: (i18nInstance, loadNotPending) => {
          if (options.bindI18n && options.bindI18n.indexOf('languageChanging') > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
        }
      });
    };
    const isString = obj => typeof obj === 'string';
    const isObject = obj => typeof obj === 'object' && obj !== null;

    const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
    const htmlEntities = {
      '&amp;': '&',
      '&#38;': '&',
      '&lt;': '<',
      '&#60;': '<',
      '&gt;': '>',
      '&#62;': '>',
      '&apos;': "'",
      '&#39;': "'",
      '&quot;': '"',
      '&#34;': '"',
      '&nbsp;': ' ',
      '&#160;': ' ',
      '&copy;': '©',
      '&#169;': '©',
      '&reg;': '®',
      '&#174;': '®',
      '&hellip;': '…',
      '&#8230;': '…',
      '&#x2F;': '/',
      '&#47;': '/'
    };
    const unescapeHtmlEntity = m => htmlEntities[m];
    const unescape$1 = text => text.replace(matchHtmlEntity, unescapeHtmlEntity);

    let defaultOptions = {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transWrapTextNodes: '',
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
      useSuspense: true,
      unescape: unescape$1
    };
    const setDefaults = (options = {}) => {
      defaultOptions = {
        ...defaultOptions,
        ...options
      };
    };
    const getDefaults = () => defaultOptions;

    let i18nInstance;
    const setI18n = instance => {
      i18nInstance = instance;
    };
    const getI18n = () => i18nInstance;

    const hasChildren = (node, checkLength) => {
      if (!node) return false;
      const base = node.props?.children ?? node.children;
      if (checkLength) return base.length > 0;
      return !!base;
    };
    const getChildren = node => {
      if (!node) return [];
      const children = node.props?.children ?? node.children;
      return node.props?.i18nIsDynamicList ? getAsArray(children) : children;
    };
    const hasValidReactChildren = children => Array.isArray(children) && children.every(mn);
    const getAsArray = data => Array.isArray(data) ? data : [data];
    const mergeProps = (source, target) => {
      const newTarget = {
        ...target
      };
      newTarget.props = Object.assign(source.props, target.props);
      return newTarget;
    };
    const nodesToString = (children, i18nOptions, i18n, i18nKey) => {
      if (!children) return '';
      let stringNode = '';
      const childrenArray = getAsArray(children);
      const keepArray = i18nOptions?.transSupportBasicHtmlNodes ? i18nOptions.transKeepBasicHtmlNodesFor ?? [] : [];
      childrenArray.forEach((child, childIndex) => {
        if (isString(child)) {
          stringNode += `${child}`;
          return;
        }
        if (mn(child)) {
          const {
            props,
            type
          } = child;
          const childPropsCount = Object.keys(props).length;
          const shouldKeepChild = keepArray.indexOf(type) > -1;
          const childChildren = props.children;
          if (!childChildren && shouldKeepChild && !childPropsCount) {
            stringNode += `<${type}/>`;
            return;
          }
          if (!childChildren && (!shouldKeepChild || childPropsCount) || props.i18nIsDynamicList) {
            stringNode += `<${childIndex}></${childIndex}>`;
            return;
          }
          if (shouldKeepChild && childPropsCount === 1 && isString(childChildren)) {
            stringNode += `<${type}>${childChildren}</${type}>`;
            return;
          }
          const content = nodesToString(childChildren, i18nOptions, i18n, i18nKey);
          stringNode += `<${childIndex}>${content}</${childIndex}>`;
          return;
        }
        if (child === null) {
          warn(i18n, 'TRANS_NULL_VALUE', `Passed in a null value as child`, {
            i18nKey
          });
          return;
        }
        if (isObject(child)) {
          const {
            format,
            ...clone
          } = child;
          const keys = Object.keys(clone);
          if (keys.length === 1) {
            const value = format ? `${keys[0]}, ${format}` : keys[0];
            stringNode += `{{${value}}}`;
            return;
          }
          warn(i18n, 'TRANS_INVALID_OBJ', `Invalid child - Object should only have keys {{ value, format }} (format is optional).`, {
            i18nKey,
            child
          });
          return;
        }
        warn(i18n, 'TRANS_INVALID_VAR', `Passed in a variable like {number} - pass variables for interpolation as full objects like {{number}}.`, {
          i18nKey,
          child
        });
      });
      return stringNode;
    };
    const renderNodes = (children, knownComponentsMap, targetString, i18n, i18nOptions, combinedTOpts, shouldUnescape) => {
      if (targetString === '') return [];
      const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
      const emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.map(keep => `<${keep}`).join('|')).test(targetString);
      if (!children && !knownComponentsMap && !emptyChildrenButNeedsHandling && !shouldUnescape) return [targetString];
      const data = knownComponentsMap ?? {};
      const getData = childs => {
        const childrenArray = getAsArray(childs);
        childrenArray.forEach(child => {
          if (isString(child)) return;
          if (hasChildren(child)) getData(getChildren(child));else if (isObject(child) && !mn(child)) Object.assign(data, child);
        });
      };
      getData(children);
      const ast = c.parse(`<0>${targetString}</0>`);
      const opts = {
        ...data,
        ...combinedTOpts
      };
      const renderInner = (child, node, rootReactNode) => {
        const childs = getChildren(child);
        const mappedChildren = mapAST(childs, node.children, rootReactNode);
        return hasValidReactChildren(childs) && mappedChildren.length === 0 || child.props?.i18nIsDynamicList ? childs : mappedChildren;
      };
      const pushTranslatedJSX = (child, inner, mem, i, isVoid) => {
        if (child.dummy) {
          child.children = inner;
          mem.push(_n(child, {
            key: i
          }, isVoid ? undefined : inner));
        } else {
          mem.push(...O.map([child], c => {
            const props = {
              ...c.props
            };
            delete props.i18nIsDynamicList;
            return _$2(c.type, {
              ...props,
              key: i,
              ref: c.props.ref ?? c.ref
            }, isVoid ? null : inner);
          }));
        }
      };
      const mapAST = (reactNode, astNode, rootReactNode) => {
        const reactNodes = getAsArray(reactNode);
        const astNodes = getAsArray(astNode);
        return astNodes.reduce((mem, node, i) => {
          const translationContent = node.children?.[0]?.content && i18n.services.interpolator.interpolate(node.children[0].content, opts, i18n.language);
          if (node.type === 'tag') {
            let tmp = reactNodes[parseInt(node.name, 10)];
            if (!tmp && knownComponentsMap) tmp = knownComponentsMap[node.name];
            if (rootReactNode.length === 1 && !tmp) tmp = rootReactNode[0][node.name];
            if (!tmp) tmp = {};
            const child = Object.keys(node.attrs).length !== 0 ? mergeProps({
              props: node.attrs
            }, tmp) : tmp;
            const isElement = mn(child);
            const isValidTranslationWithChildren = isElement && hasChildren(node, true) && !node.voidElement;
            const isEmptyTransWithHTML = emptyChildrenButNeedsHandling && isObject(child) && child.dummy && !isElement;
            const isKnownComponent = isObject(knownComponentsMap) && Object.hasOwnProperty.call(knownComponentsMap, node.name);
            if (isString(child)) {
              const value = i18n.services.interpolator.interpolate(child, opts, i18n.language);
              mem.push(value);
            } else if (hasChildren(child) || isValidTranslationWithChildren) {
              const inner = renderInner(child, node, rootReactNode);
              pushTranslatedJSX(child, inner, mem, i);
            } else if (isEmptyTransWithHTML) {
              const inner = mapAST(reactNodes, node.children, rootReactNode);
              pushTranslatedJSX(child, inner, mem, i);
            } else if (Number.isNaN(parseFloat(node.name))) {
              if (isKnownComponent) {
                const inner = renderInner(child, node, rootReactNode);
                pushTranslatedJSX(child, inner, mem, i, node.voidElement);
              } else if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
                if (node.voidElement) {
                  mem.push(_$2(node.name, {
                    key: `${node.name}-${i}`
                  }));
                } else {
                  const inner = mapAST(reactNodes, node.children, rootReactNode);
                  mem.push(_$2(node.name, {
                    key: `${node.name}-${i}`
                  }, inner));
                }
              } else if (node.voidElement) {
                mem.push(`<${node.name} />`);
              } else {
                const inner = mapAST(reactNodes, node.children, rootReactNode);
                mem.push(`<${node.name}>${inner}</${node.name}>`);
              }
            } else if (isObject(child) && !isElement) {
              const content = node.children[0] ? translationContent : null;
              if (content) mem.push(content);
            } else {
              pushTranslatedJSX(child, translationContent, mem, i, node.children.length !== 1 || !translationContent);
            }
          } else if (node.type === 'text') {
            const wrapTextNodes = i18nOptions.transWrapTextNodes;
            const content = shouldUnescape ? i18nOptions.unescape(i18n.services.interpolator.interpolate(node.content, opts, i18n.language)) : i18n.services.interpolator.interpolate(node.content, opts, i18n.language);
            if (wrapTextNodes) {
              mem.push(_$2(wrapTextNodes, {
                key: `${node.name}-${i}`
              }, content));
            } else {
              mem.push(content);
            }
          }
          return mem;
        }, []);
      };
      const result = mapAST([{
        dummy: true,
        children: children || []
      }], ast, getAsArray(children || []));
      return getChildren(result[0]);
    };
    const fixComponentProps = (component, index, translation) => {
      const componentKey = component.key || index;
      const comp = _n(component, {
        key: componentKey
      });
      if (!comp.props || !comp.props.children || translation.indexOf(`${index}/>`) < 0 && translation.indexOf(`${index} />`) < 0) {
        return comp;
      }
      function Componentized() {
        return _$2(k$1, null, comp);
      }
      return _$2(Componentized, {
        key: componentKey
      });
    };
    const generateArrayComponents = (components, translation) => components.map((c, index) => fixComponentProps(c, index, translation));
    const generateObjectComponents = (components, translation) => {
      const componentMap = {};
      Object.keys(components).forEach(c => {
        Object.assign(componentMap, {
          [c]: fixComponentProps(components[c], c, translation)
        });
      });
      return componentMap;
    };
    const generateComponents = (components, translation, i18n, i18nKey) => {
      if (!components) return null;
      if (Array.isArray(components)) {
        return generateArrayComponents(components, translation);
      }
      if (isObject(components)) {
        return generateObjectComponents(components, translation);
      }
      warnOnce(i18n, 'TRANS_INVALID_COMPONENTS', `<Trans /> "components" prop expects an object or array`, {
        i18nKey
      });
      return null;
    };
    const isComponentsMap = object => {
      if (!isObject(object)) return false;
      if (Array.isArray(object)) return false;
      return Object.keys(object).reduce((acc, key) => acc && Number.isNaN(Number.parseFloat(key)), true);
    };
    function Trans$1({
      children,
      count,
      parent,
      i18nKey,
      context,
      tOptions = {},
      values,
      defaults,
      components,
      ns,
      i18n: i18nFromProps,
      t: tFromProps,
      shouldUnescape,
      ...additionalProps
    }) {
      const i18n = i18nFromProps || getI18n();
      if (!i18n) {
        warnOnce(i18n, 'NO_I18NEXT_INSTANCE', `Trans: You need to pass in an i18next instance using i18nextReactModule`, {
          i18nKey
        });
        return children;
      }
      const t = tFromProps || i18n.t.bind(i18n) || (k => k);
      const reactI18nextOptions = {
        ...getDefaults(),
        ...i18n.options?.react
      };
      let namespaces = ns || t.ns || i18n.options?.defaultNS;
      namespaces = isString(namespaces) ? [namespaces] : namespaces || ['translation'];
      const nodeAsString = nodesToString(children, reactI18nextOptions, i18n, i18nKey);
      const defaultValue = defaults || nodeAsString || reactI18nextOptions.transEmptyNodeValue || (typeof i18nKey === 'function' ? keysFromSelector(i18nKey) : i18nKey);
      const {
        hashTransKey
      } = reactI18nextOptions;
      const key = i18nKey || (hashTransKey ? hashTransKey(nodeAsString || defaultValue) : nodeAsString || defaultValue);
      if (i18n.options?.interpolation?.defaultVariables) {
        values = values && Object.keys(values).length > 0 ? {
          ...values,
          ...i18n.options.interpolation.defaultVariables
        } : {
          ...i18n.options.interpolation.defaultVariables
        };
      }
      const interpolationOverride = values || count !== undefined && !i18n.options?.interpolation?.alwaysFormat || !children ? tOptions.interpolation : {
        interpolation: {
          ...tOptions.interpolation,
          prefix: '#$?',
          suffix: '?$#'
        }
      };
      const combinedTOpts = {
        ...tOptions,
        context: context || tOptions.context,
        count,
        ...values,
        ...interpolationOverride,
        defaultValue,
        ns: namespaces
      };
      const translation = key ? t(key, combinedTOpts) : defaultValue;
      const generatedComponents = generateComponents(components, translation, i18n, i18nKey);
      let indexedChildren = generatedComponents || children;
      let componentsMap = null;
      if (isComponentsMap(generatedComponents)) {
        componentsMap = generatedComponents;
        indexedChildren = children;
      }
      const content = renderNodes(indexedChildren, componentsMap, translation, i18n, reactI18nextOptions, combinedTOpts, shouldUnescape);
      const useAsParent = parent ?? reactI18nextOptions.defaultTransParent;
      return useAsParent ? _$2(useAsParent, additionalProps, content) : content;
    }

    const initReactI18next = {
      type: '3rdParty',
      init(instance) {
        setDefaults(instance.options.react);
        setI18n(instance);
      }
    };

    const I18nContext = Q$1();
    class ReportNamespaces {
      constructor() {
        this.usedNamespaces = {};
      }
      addUsedNamespaces(namespaces) {
        namespaces.forEach(ns => {
          if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
        });
      }
      getUsedNamespaces() {
        return Object.keys(this.usedNamespaces);
      }
    }

    function Trans({
      children,
      count,
      parent,
      i18nKey,
      context,
      tOptions = {},
      values,
      defaults,
      components,
      ns,
      i18n: i18nFromProps,
      t: tFromProps,
      shouldUnescape,
      ...additionalProps
    }) {
      const {
        i18n: i18nFromContext,
        defaultNS: defaultNSFromContext
      } = x$1(I18nContext) || {};
      const i18n = i18nFromProps || i18nFromContext || getI18n();
      const t = tFromProps || i18n?.t.bind(i18n);
      return Trans$1({
        children,
        count,
        parent,
        i18nKey,
        context,
        tOptions,
        values,
        defaults,
        components,
        ns: ns || t?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
        i18n,
        t: tFromProps,
        shouldUnescape,
        ...additionalProps
      });
    }

    const usePrevious = (value, ignore) => {
      const ref = A();
      y$2(() => {
        ref.current = value;
      }, [value, ignore]);
      return ref.current;
    };
    const alwaysNewT = (i18n, language, namespace, keyPrefix) => i18n.getFixedT(language, namespace, keyPrefix);
    const useMemoizedT = (i18n, language, namespace, keyPrefix) => q$2(alwaysNewT(i18n, language, namespace, keyPrefix), [i18n, language, namespace, keyPrefix]);
    const useTranslation = (ns, props = {}) => {
      const {
        i18n: i18nFromProps
      } = props;
      const {
        i18n: i18nFromContext,
        defaultNS: defaultNSFromContext
      } = x$1(I18nContext) || {};
      const i18n = i18nFromProps || i18nFromContext || getI18n();
      if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
      if (!i18n) {
        warnOnce(i18n, 'NO_I18NEXT_INSTANCE', 'useTranslation: You will need to pass in an i18next instance by using initReactI18next');
        const notReadyT = (k, optsOrDefaultValue) => {
          if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
          if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
          return Array.isArray(k) ? k[k.length - 1] : k;
        };
        const retNotReady = [notReadyT, {}, false];
        retNotReady.t = notReadyT;
        retNotReady.i18n = {};
        retNotReady.ready = false;
        return retNotReady;
      }
      if (i18n.options.react?.wait) warnOnce(i18n, 'DEPRECATED_OPTION', 'useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.');
      const i18nOptions = {
        ...getDefaults(),
        ...i18n.options.react,
        ...props
      };
      const {
        useSuspense,
        keyPrefix
      } = i18nOptions;
      let namespaces = defaultNSFromContext || i18n.options?.defaultNS;
      namespaces = isString(namespaces) ? [namespaces] : namespaces || ['translation'];
      i18n.reportNamespaces.addUsedNamespaces?.(namespaces);
      const ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(n => hasLoadedNamespace(n, i18n, i18nOptions));
      const memoGetT = useMemoizedT(i18n, props.lng || null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
      const getT = () => memoGetT;
      const getNewT = () => alwaysNewT(i18n, props.lng || null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
      const [t, setT] = d$1(getT);
      let joinedNS = namespaces.join();
      if (props.lng) joinedNS = `${props.lng}${joinedNS}`;
      const previousJoinedNS = usePrevious(joinedNS);
      const isMounted = A(true);
      y$2(() => {
        const {
          bindI18n,
          bindI18nStore
        } = i18nOptions;
        isMounted.current = true;
        if (!ready && !useSuspense) {
          if (props.lng) {
            loadLanguages(i18n, props.lng, namespaces, () => {
              if (isMounted.current) setT(getNewT);
            });
          } else {
            loadNamespaces(i18n, namespaces, () => {
              if (isMounted.current) setT(getNewT);
            });
          }
        }
        if (ready && previousJoinedNS && previousJoinedNS !== joinedNS && isMounted.current) {
          setT(getNewT);
        }
        const boundReset = () => {
          if (isMounted.current) setT(getNewT);
        };
        if (bindI18n) i18n?.on(bindI18n, boundReset);
        if (bindI18nStore) i18n?.store.on(bindI18nStore, boundReset);
        return () => {
          isMounted.current = false;
          if (i18n && bindI18n) bindI18n?.split(' ').forEach(e => i18n.off(e, boundReset));
          if (bindI18nStore && i18n) bindI18nStore.split(' ').forEach(e => i18n.store.off(e, boundReset));
        };
      }, [i18n, joinedNS]);
      y$2(() => {
        if (isMounted.current && ready) {
          setT(getT);
        }
      }, [i18n, keyPrefix, ready]);
      const ret = [t, i18n, ready];
      ret.t = t;
      ret.i18n = i18n;
      ret.ready = ready;
      if (ready) return ret;
      if (!ready && !useSuspense) return ret;
      throw new Promise(resolve => {
        if (props.lng) {
          loadLanguages(i18n, props.lng, namespaces, () => resolve());
        } else {
          loadNamespaces(i18n, namespaces, () => resolve());
        }
      });
    };

    var en = {
    	translation: {
    		no: "no",
    		yes: "yes",
    		"bm-hum-info-button": "Your device model does not include a enthalpy heat exchanger.<br /><br />For information on retrofitting, please visit <1>https://blumartin.de/nachruestung/</1>",
    		"no-co2-info": "Your device model does not include a CO₂ Sensor.<br /><br />For information on retrofitting, please visit <1>https://blumartin.de/nachruestung/</1>",
    		"Comfort Level": "Comfort Level",
    		"Operation Mode": "Operation Mode",
    		"Set the parameters": "Set the parameters:",
    		Submit_delayed: "Submit (delayed)",
    		states: {
    			cmf: {
    				short: "cmf",
    				long: "Comfort"
    			},
    			slp: {
    				short: "slp",
    				long: "Sleep"
    			},
    			trb: {
    				short: "trb",
    				long: "Turbo"
    			},
    			trc: {
    				short: "trc",
    				long: "Turbo Cool"
    			},
    			srv: {
    				short: "srv",
    				long: "Service"
    			},
    			tst: {
    				short: "tst",
    				long: "Test"
    			},
    			mnu: {
    				short: "mnu",
    				long: "Manufacturer"
    			},
    			hrd: {
    				short: "hrd",
    				long: "Hum.Reduction"
    			}
    		},
    		program: {
    			water_ins_short: "win",
    			cooling_short: "col",
    			co2_short: "co2",
    			min_vent_short: "mve",
    			hr_rel_short: "hrr",
    			hr_abs_short: "hra",
    			hum_ins_short: "hin",
    			out_temp_short: "otb"
    		},
    		tabs: {
    			overview: "Overview",
    			details: "Details",
    			diagrams: "Diagrams",
    			minute_values: "Minute Values",
    			daily_values: "Daily Values",
    			monthly_values: "Monthly Values",
    			help: "Help"
    		},
    		overview: {
    			air_flow: "Air Flow",
    			heat_recovery: "Heat Recovery",
    			cooling_power: "Cooling Power",
    			energy_recovery: "Energy Recovery",
    			exhaust: "Exhaust",
    			extract: "Extract",
    			extract_filter_tl: "Filter Extract",
    			humidity_abs_extract: "Humidity",
    			humidity_abs_outdoor: "Humidity",
    			humidity_recovery: "Humidity Recovery",
    			humidity_rel_extract: "Humidity",
    			humidity_rel_outdoor: "Humidity",
    			humidity_tl: "Humidity",
    			outdoor: "Outdoor",
    			power_recovery: "Energy Savings",
    			service: "Service",
    			supply: "Supply",
    			supply_filter_tl: "Filter Supply",
    			temperature_exhaust: "Temperature",
    			temperature_extract: "Temperature",
    			temperature_outdoor: "Temperature",
    			temperature_supply: "Temperature",
    			humidity_recovery_active: "active",
    			humidity_recovery_inactive: "inactive"
    		},
    		key: {
    			submit: "Submit",
    			label: "Please enter the key:",
    			problem: "There was a problem:",
    			pwd_show: "Show password",
    			pwd_hide: "Hide password"
    		},
    		PL: {
    			"2nd_room_adapter": "2nd Room Adapter",
    			ADY: "ADY",
    			AFL: "AFL",
    			air_density: "Air Density",
    			air_flow: "Air Flow",
    			air_pressure: "Air Pressure",
    			APR: "APR",
    			comfort_level: "Comfort Level",
    			error_state: "Error State",
    			ES: "ES",
    			exhaust_temperature: "Exhaust Temperature",
    			extract_humidity: "Extract Humidity",
    			extract_temperature: "Extract Temperature",
    			fan_speed_extract: "Fan Speed Extract",
    			fan_speed_supply: "Fan Speed Supply",
    			FIH: "FIH",
    			filter_hours: "Filter Hours",
    			FSE: "FSE",
    			FSS: "FSS",
    			heat_recovery_abs: "Heat Recovery",
    			heat_recovery_rel: "Heat Recovery",
    			HET: "HET",
    			HOU: "HOU",
    			HR: "HR",
    			HRP: "HRP",
    			HRW: "HRW",
    			humidity_reduction: "Humidity Reduction Mode",
    			OM: "OM",
    			operating_hours: "Operating Hours",
    			operating_mode: "Operation Mode",
    			OPH: "OPH",
    			outdoor_humidity: "Outdoor Humidity",
    			outdoor_temperature: "Outdoor Temperature",
    			program: "Program",
    			RA: "RA",
    			reduction: "Reduction",
    			room_area: "Room Area",
    			RSSI_value: "RSSI-Value",
    			SC: "SC",
    			serial_number: "Serial Number",
    			summer_cooling: "Summer Cooling",
    			supply_temperature: "Supply Temperature (cal.)",
    			supply_temperature_sens: "Supply Temperature",
    			TEH: "TEH",
    			TET: "TET",
    			TIM: "TIM",
    			timestamp: "Timestamp",
    			TOU: "TOU",
    			TSC: "TSC",
    			TSU: "TSU"
    		}
    	}
    };
    var de = {
    	translation: {
    		no: "nein",
    		yes: "ja",
    		"bm-hum-info-button": "Bei Ihrer Gerätevariante ist ein Enthalpie Wärmetauscher nicht Teil der Ausstattung.<br /><br />Informationen zu Nachrüstungen finden Sie unter <1>https://blumartin.de/nachruestung/</1>",
    		"no-co2-info": "Bei Ihrer Gerätevariante ist ein CO₂ Sensor nicht Teil der Ausstattung. <br /><br />Informationen zu Nachrüstungen finden Sie unter <1>https://blumartin.de/nachruestung/</1>",
    		"Comfort Level": "Comfort Level",
    		"Operation Mode": "Betriebsart",
    		"Set the parameters": "Setzen Sie die Parameter:",
    		Submit_delayed: "Anwenden (zeitverzögert)",
    		states: {
    			cmf: {
    				short: "cmf",
    				long: "Comfort"
    			},
    			slp: {
    				short: "slp",
    				long: "Sleep"
    			},
    			trb: {
    				short: "trb",
    				long: "Turbo"
    			},
    			trc: {
    				short: "trc",
    				long: "Turbo Cool"
    			},
    			srv: {
    				short: "srv",
    				long: "Service"
    			},
    			tst: {
    				short: "tst",
    				long: "Test"
    			},
    			mnu: {
    				short: "mnu",
    				long: "Manufacturer"
    			},
    			hrd: {
    				short: "hrd",
    				long: "Entfeuchtung"
    			}
    		},
    		program: {
    			water_ins_short: "wet",
    			cooling_short: "kuh",
    			co2_short: "co2",
    			min_vent_short: "mnl",
    			hr_rel_short: "efr",
    			hr_abs_short: "efa",
    			hum_ins_short: "fet",
    			out_temp_short: "alu"
    		},
    		tabs: {
    			overview: "Aktuelle Werte",
    			details: "Geräte-Infos",
    			diagrams: "Diagramme",
    			minute_values: "Minuten-Werte",
    			daily_values: "Tages-Werte",
    			monthly_values: "Monats-Werte",
    			help: "Hilfe"
    		},
    		overview: {
    			air_flow: "Luftstrom",
    			heat_recovery: "Wärmerückgewinnung",
    			cooling_power: "Kühlleistung",
    			energy_recovery: "Energierückgewinnung",
    			exhaust: "Fortluft",
    			extract: "Abluft",
    			extract_filter_tl: "Abluftfilter",
    			humidity_abs_extract: "Feuchtigkeit",
    			humidity_abs_outdoor: "Feuchtigkeit",
    			humidity_recovery: "Feuchterückgewinnung",
    			humidity_rel_extract: "Feuchtigkeit",
    			humidity_rel_outdoor: "Feuchtigkeit",
    			humidity_tl: "Feuchtigkeit",
    			humidity_recovery_active: "aktiv",
    			humidity_recovery_inactive: "inaktiv",
    			outdoor: "Außenluft",
    			power_recovery: "Energieeinsparung",
    			service: "Service",
    			supply: "Zuluft",
    			supply_filter_tl: "Außenluftfilter",
    			temperature_exhaust: "Temperatur",
    			temperature_extract: "Temperatur",
    			temperature_outdoor: "Temperatur",
    			temperature_supply: "Temperatur"
    		},
    		key: {
    			submit: "Anwenden",
    			label: "Bitte geben Sie den Schlüssel ein:",
    			problem: "Es gab ein Problem:",
    			pwd_show: "Passwort anzeigen",
    			pwd_hide: "Passwort verstecken"
    		},
    		PL: {
    			"2nd_room_adapter": "Zweitraum-Anschluss",
    			ADY: "LDI",
    			AFL: "LST",
    			air_density: "Luftdichte",
    			air_flow: "Luftstrom",
    			air_pressure: "Luftdruck",
    			APR: "LDR",
    			comfort_level: "Comfort-Level",
    			error_state: "Fehlerstatus",
    			ES: "FS",
    			exhaust_temperature: "Temperatur Fortluft",
    			extract_humidity: "Feuchtigkeit Abluft",
    			extract_temperature: "Temperatur Abluft",
    			fan_speed_extract: "Ventilatorgeschw. Abluft",
    			fan_speed_supply: "Ventilatorgeschw. Zuluft",
    			FIH: "FST",
    			filter_hours: "Filterstunden",
    			FSE: "VGA",
    			FSS: "VGZ",
    			heat_recovery_abs: "Wärmerückgewinnung",
    			heat_recovery_rel: "Wärmerückgewinnung",
    			HET: "FAB",
    			HOU: "FAU",
    			HR: "EM",
    			HRP: "WRP",
    			HRW: "WRW",
    			humidity_reduction: "Entfeuchtungs-Modus",
    			OM: "BA",
    			operating_hours: "Betriebsstunden",
    			operating_mode: "Betriebsart",
    			OPH: "BST",
    			outdoor_humidity: "Feuchtigkeit Außen",
    			outdoor_temperature: "Temperatur Außen",
    			program: "Programm",
    			RA: "RF",
    			reduction: "Reduktion",
    			room_area: "Raumfläche",
    			RSSI_value: "RSSI-Wert",
    			SC: "SK",
    			serial_number: "Seriennummer",
    			summer_cooling: "Sommer-Kühlung",
    			supply_temperature: "Temperatur Zuluft (ber.)",
    			supply_temperature_sens: "Temperatur Zuluft",
    			TEH: "TFO",
    			TET: "TAB",
    			TIM: "ZEIT",
    			timestamp: "Zeit",
    			TOU: "TAU",
    			TSC: "TZB",
    			TSU: "TZU"
    		}
    	}
    };
    const translations = {
    	en: en,
    	de: de
    };

    console.log(translations);
    instance
        .use(initReactI18next) // passes i18n down to react-i18next
        .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: translations,
        lng: "de", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",
        keySeparator: ".",
        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });

    function Popup(props) {
        y$2(() => {
            const close = (e) => {
                if (e.key === 'Escape') {
                    props.setShow(false);
                }
            };
            window.addEventListener('keydown', close);
            return () => window.removeEventListener('keydown', close);
        }, []);
        let clickBackground = (e) => {
            if (e.currentTarget != e.target || props.clickBackground === false)
                return;
            props.setShow(false);
        };
        return u("div", { class: "bm-popup-container", onClick: clickBackground, children: u("div", { class: "bm-popup " + props.className, children: [u("button", { id: "button_close", type: "button", class: "close button-xclass close-button", "aria-label": "Close", onClick: _ => props.setShow(false), children: u("span", { id: "close_x", "aria-hidden": "true", children: "\u00D7" }) }), props.children] }) });
    }

    function InfoButton({ children, ...rest }) {
        const [show, setShow] = d$1(false);
        return u(k$1, { children: [u("img", { ...rest, width: "24", height: "24", src: "/images/information.svg", onClick: _ => setShow(true), class: "bm-info-icon" }), show && u(Popup, { setShow: setShow, children: children })] });
    }

    function CO2InfoButton(props) {
        return u(InfoButton, { ...props, children: u(Trans, { i18nKey: "no-co2-info", components: {
                    1: u("a", { href: "https://blumartin.de/nachruestung/" })
                } }) });
    }

    function getHeatRecoveryPercentage(primlog) {
        if (primlog.AirFlow == 0) {
            return 100;
        }
        if (Math.abs(primlog.TempExtract - primlog.TempOutdoor) < 2) {
            return 100;
        }
        var val = (100. * (1. -
            (primlog.TempExtract - primlog.TempSupply) /
                (primlog.TempExtract - primlog.TempOutdoor))
            + 0.5);
        return val.toFixed(1);
    }
    /*
     * Wärmekapazität Luft:                    1000 Ws/(kg*K)
     * Dichte der Luft by 0°C und Normaldruck: 1.29 kg/m³
     * Volumenstrom ist in m³/h angegeben. Alle Faktoren zusammen (Wärmekapazität,
     * Volumenstrom pro Stunde, 3600 s/h und Dichte ergeben einen Faktor von 0.33
     */
    function getPowerRecovery(primlog) {
        if (Math.abs(primlog.TempExtract - primlog.TempOutdoor) < 2) {
            return 0;
        }
        var recovery1 = primlog.AirFlow * (primlog.TempSupply - primlog.TempOutdoor);
        return (recovery1 / 3 + 0.5).toFixed(1);
    }
    function getCoolingPower(primlog) {
        return (primlog.AirFlow * (primlog.TempExtract - primlog.TempSupply) / 3 + 0.5).toFixed(1); //TODO potrebujeme + 0.5?
        /*
             Wärmekapazität Luft:                    1000 Ws/(kg*K)
             Dichte der Luft by 0°C und Normaldruck: 1.29 kg/m³
             Volumenstrom ist in m³/h angegeben. Alle Faktoren zusammen (Wärmekapazität,
             Volumenstrom pro Stunde, 3600 s/h und Dichte ergeben einen Faktor von 0.33
        */
    }
    function humidityTlCalc(hum) {
        if (hum != undefined) {
            if (hum < 10 || hum > 85)
                return 4;
            if (hum < 20 || hum > 70)
                return 3;
            if (hum < 30 || hum > 60)
                return 2;
            return 1;
        }
    }
    function co2TlCalc(co2) {
        if (co2 != undefined) {
            if (co2 < 1000)
                return 1;
            if (co2 < 1700)
                return 2;
            if (co2 < 2500)
                return 3;
            return 4;
        }
    }

    function TrafficLight(props) {
        return u("ul", { class: "grade-type", children: [u("li", { className: props.value == 1 ? "active" : "" }), u("li", { className: props.value == 2 ? "active" : "" }), u("li", { className: props.value == 3 ? "active" : "" }), u("li", { className: props.value == 4 ? "active" : "" })] });
    }

    function filterExtractStatus(fanExtractRPM, fanSpeed) {
        let fanExtractRPMs = [];
        fanExtractRPMs[0] = [20, 920, 1560];
        fanExtractRPMs[1] = [30, 1040, 1680];
        fanExtractRPMs[2] = [40, 1260, 1900];
        fanExtractRPMs[3] = [50, 1480, 2200];
        fanExtractRPMs[4] = [60, 1700, 2420];
        fanExtractRPMs[5] = [70, 1910, 2710];
        fanExtractRPMs[6] = [85, 2210, 2930];
        fanExtractRPMs[7] = [100, 2480, 3200];
        fanExtractRPMs[8] = [0, 0, 0];
        let status = filterStatus(fanExtractRPM, fanSpeed, fanExtractRPMs);
        return status;
    }
    function filterSupplyStatus(fanSupplyRPM, fanSpeed) {
        let fanSupplyRPMs = [];
        fanSupplyRPMs[0] = [20, 870, 1510];
        fanSupplyRPMs[1] = [30, 1000, 1640];
        fanSupplyRPMs[2] = [40, 1230, 1870];
        fanSupplyRPMs[3] = [50, 1460, 2100];
        fanSupplyRPMs[4] = [60, 1690, 2410];
        fanSupplyRPMs[5] = [70, 1910, 2630];
        fanSupplyRPMs[6] = [85, 2230, 2950];
        fanSupplyRPMs[7] = [100, 2540, 3260];
        fanSupplyRPMs[8] = [0, 0, 0];
        let status = filterStatus(fanSupplyRPM, fanSpeed, fanSupplyRPMs);
        return status;
    }
    function filterStatus(fanRPM, fanSpeed, filterRPMs) {
        fanSpeed = fanSpeed * 10;
        for (let rpm of filterRPMs) {
            if (rpm[0] < fanSpeed) {
                continue;
            }
            let nDiff = rpm[2] - rpm[1];
            if (fanRPM < (rpm[1] - nDiff / 2))
                return 100;
            if (fanRPM < (rpm[1] + nDiff * 0.4))
                return 1;
            if (fanRPM < (rpm[1] + nDiff * 0.7))
                return 2;
            if (fanRPM < (rpm[1] + nDiff * 0.95))
                return 3;
            return 4;
        }
    }

    function HumidityInfoButton(props) {
        return u(InfoButton, { ...props, children: u(Trans, { i18nKey: "bm-hum-info-button", components: {
                    1: u("a", { href: "https://blumartin.de/nachruestung/" })
                } }) });
    }

    function getSerialnumber() {
        const serialnumber = document.getElementById("srPHP")?.getAttribute("value");
        if (serialnumber == null) {
            throw Error("no serialnumber found");
        }
        return serialnumber;
    }

    function ButtonPopup(props) {
        const { t } = useTranslation();
        const [error, setError] = d$1();
        y$2(() => {
            let mapping = {
                0: "RB_OM_AutoStd",
                1: "RB_OM_AutoStd",
                2: "RB_OM_Sleep",
                3: "RB_OM_Turbo",
                4: "RB_OM_TurboCool"
            };
            let state = mapping[0];
            if (overviewSignal.value !== undefined) {
                state = mapping[overviewSignal.value.State];
                document.getElementById("RB_CL_" + overviewSignal.value.ComfortLevel)?.setAttribute('checked', "true");
            }
            document.getElementById(state)?.setAttribute('checked', "true");
        }, [overviewSignal]);
        console.log(overviewSignal.value);
        let onsubmit = async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const serialnumber = getSerialnumber();
            formData.append("serialnumber", serialnumber);
            try {
                let res = await Api.postButton(formData);
                if (res.status != 200) {
                    console.log(res);
                    setError(res);
                }
                else {
                    props.setShow(false);
                }
            }
            catch (e) {
                // TODO
                setError({ status: 500, statusText: "exception at request" });
            }
        };
        return u(Popup, { setShow: props.setShow, children: u("form", { id: "form_button", onSubmit: onsubmit, method: "post", children: [u("p", { id: "buttonFunc_heading", class: "form-label heading-details trans", children: t("Set the parameters") }), error && u("p", { children: [error.status, " ", error.statusText] }), u("div", { class: "form-group flex-column stretched", children: [u("div", { class: "col-button", children: [u("h4", { class: "subheader", children: t('Comfort Level') }), u("fieldset", { id: "RB_CL", name: "CL", children: u("table", { children: [u("tr", { children: [u("td", { children: u("input", { id: "RB_CL_1", type: "radio", value: "1", name: "CL" }) }), u("td", { children: u("label", { class: "value-rb", children: "1" }) })] }), u("tr", { children: [u("td", { children: u("input", { id: "RB_CL_2", type: "radio", value: "2", name: "CL" }) }), u("td", { children: u("label", { class: "value-rb", children: "2" }) })] }), u("tr", { children: [u("td", { children: u("input", { id: "RB_CL_3", type: "radio", value: "3", name: "CL" }) }), u("td", { children: u("label", { class: "value-rb", children: "3" }) })] }), u("tr", { children: [u("td", { children: u("input", { id: "RB_CL_4", type: "radio", value: "4", name: "CL" }) }), u("td", { children: u("label", { class: "value-rb", children: "4" }) })] }), u("tr", { children: [u("td", { children: u("input", { id: "RB_CL_5", type: "radio", value: "5", name: "CL" }) }), u("td", { children: u("label", { class: "value-rb", children: "5" }) })] })] }) })] }), u("div", { class: "col-button", children: [u("h4", { id: "buttonFunc_OM", class: "subheader trans", children: t("Operation Mode") }), u("fieldset", { id: "RB_OM", name: "OM", children: u("table", { children: [u("tr", { children: [u("td", { children: u("input", { id: "RB_OM_AutoStd", type: "radio", class: "rb", value: "1", name: "OM" }) }), u("td", { children: u("label", { class: "value-rb", children: "Comfort" }) })] }), u("tr", { children: [u("td", { children: u("input", { id: "RB_OM_Sleep", type: "radio", class: "rb", value: "2", name: "OM" }) }), u("td", { children: u("label", { class: "value-rb", children: "Sleep" }) })] }), u("tr", { children: [u("td", { children: u("input", { id: "RB_OM_Turbo", type: "radio", class: "rb", value: "3", name: "OM" }) }), u("td", { children: u("label", { class: "value-rb", children: "Turbo" }) })] }), u("tr", { children: [u("td", { children: u("input", { id: "RB_OM_TurboCool", type: "radio", class: "rb", value: "4", name: "OM" }) }), u("td", { children: u("label", { class: "value-rb", children: "Turbo Cool" }) })] })] }) })] })] }), u("br", {}), u("button", { id: "buttonFunc_submit", class: "btn btn-primary btn-block trans", children: t("Submit_delayed") })] }) });
    }
    function FreeAirButton() {
        const [show, setShow] = d$1(false);
        const click = async () => {
            const serialnumber = parseInt(getSerialnumber());
            try {
                await Api.getValues(serialnumber);
            }
            catch (e) {
                loginSignal.value = true;
                return;
            }
            setShow(true);
        };
        return u(k$1, { children: [u("button", { class: "btn-img", onClick: click }), show && u(ButtonPopup, { setShow: setShow })] });
    }

    function Overview() {
        const { t, i18n } = useTranslation();
        const humidity_tl = () => humidityTlCalc(overviewSignal.value?.HumExtract);
        const co2_tl = () => co2TlCalc(overviewSignal.value?.CO2);
        const filter_supply_tl = () => {
            if (overviewSignal.value != undefined && overviewSignal.value.FanSupplyRPM != undefined && overviewSignal.value.FanSpeed != undefined) {
                return filterSupplyStatus(overviewSignal.value.FanSupplyRPM, overviewSignal.value.FanSpeed);
            }
        };
        const filter_extract_tl = () => {
            if (overviewSignal.value != undefined && overviewSignal.value.FanExtractRPM != undefined && overviewSignal.value.FanSpeed != undefined) {
                return filterExtractStatus(overviewSignal.value.FanExtractRPM, overviewSignal.value.FanSpeed);
            }
        };
        return u("div", { class: "container", children: [errorSignal.value &&
                    u("div", { id: "error_div", children: [errorSignal.value[i18n.language].pre, ' ', errorSignal.value[i18n.language].long, ' ', errorSignal.value[i18n.language].part2] }), u("div", { class: "row", children: [u("div", { class: "col-sm-6 row overview-list", children: [u("div", { class: "col-sm-7 col-xs-8", children: [u("div", { class: "overview-main", children: [u("h3", { class: "name", children: t('overview.air_flow') }), u("p", { class: "value", children: [overviewSignal.value?.AirFlow, u("span", { class: "units", children: [" m", u("sup", { children: "3" }), "/h"] })] })] }), overviewSignal.value?.bSumCooling == 0 &&
                                            u("div", { class: "overview-main", children: [u("h3", { class: "name", children: t('overview.heat_recovery') }), u("p", { class: "value", children: [overviewSignal.value && getHeatRecoveryPercentage(overviewSignal.value), u("span", { class: "units", children: " %" })] })] }), overviewSignal.value?.bSumCooling != 0 &&
                                            u("div", { class: "overview-main", children: [u("h3", { class: "name", children: t('overview.cooling_power') }), u("p", { class: "value", children: [overviewSignal.value && getCoolingPower(overviewSignal.value), u("span", { class: "units", children: " W" })] })] }), overviewSignal.value?.bSumCooling == 0 &&
                                            u("div", { class: "overview-main", children: [u("h3", { class: "name", children: t('overview.energy_recovery') }), u("p", { class: "value", children: [overviewSignal.value && getPowerRecovery(overviewSignal.value), " ", u("span", { class: "units", children: " W" })] })] }), u("div", { class: "overview-main", style: "position: relative", children: [u("h3", { style: "display:inline", class: "name", children: t('overview.humidity_recovery') }), overviewSignal.value?.hasEnthalpyHeatExchanger == false && u(HumidityInfoButton, { className: "bm-hum-info-button" }), (overviewSignal.value?.hasEnthalpyHeatExchanger && overviewSignal.value?.AirFlow > 0) ?
                                                    u("p", { class: "value", children: t('overview.humidity_recovery_active') })
                                                    :
                                                        u("p", { class: "value", children: t('overview.humidity_recovery_inactive') })] })] }), u("div", { class: "col-sm-5 col-xs-4 freeair-container", children: [u("img", { src: "images/image.png", class: "freeair-logo" }), u(FreeAirButton, {})] }), u("div", { class: "col-sm-12 col-xs-12", children: u("div", { class: "overview-grade", children: u("div", { class: "grade-info", children: [u("div", { class: "grade-item", children: [u("p", { class: "label", children: t('overview.humidity_tl') }), u(TrafficLight, { value: humidity_tl() })] }), u("div", { class: "grade-item", children: [u("p", { class: "label", children: ["CO", u("sub", { children: "2" })] }), u(TrafficLight, { value: co2_tl() })] }), u("div", { class: "grade-item", children: [u("p", { class: "label", children: t('overview.supply_filter_tl') }), u(TrafficLight, { value: filter_supply_tl() })] }), u("div", { class: "grade-item", children: [u("p", { class: "label", children: t('overview.extract_filter_tl') }), u(TrafficLight, { value: filter_extract_tl() })] })] }) }) })] }), u("div", { class: "col-sm-6 overview-list", children: [u("div", { class: "overview-type", children: [u("h3", { class: "name text-outdoor", children: t('overview.outdoor') }), u("div", { class: "values", children: [u("p", { class: "value", children: [u("span", { class: "label", children: t('overview.temperature_outdoor') }), overviewSignal.value?.TempOutdoor.toFixed(1), u("span", { class: "units", children: " \u00B0C" })] }), u("p", { class: "value", children: [u("span", { class: "label", children: [t('overview.humidity_rel_outdoor'), " (rel)"] }), overviewSignal.value?.HumOutdoor, u("span", { class: "units", children: " %" })] }), u("p", { class: "value", children: [u("span", { class: "label", children: [t('overview.humidity_abs_outdoor'), " (abs)"] }), overviewSignal.value?.absHumOutdoor, u("span", { class: "units", children: [" g/m", u("sup", { children: "3" })] })] })] })] }), u("div", { class: "overview-type", children: [u("h3", { class: "name text-supply", children: t('overview.supply') }), u("div", { class: "values", children: u("p", { class: "value", children: [u("span", { class: "label", children: t('overview.temperature_supply') }), overviewSignal.value?.TempSupply.toFixed(1), u("span", { class: "units", children: " \u00B0C" })] }) })] }), u("div", { class: "overview-type", children: [u("h3", { class: "name text-extract", children: t('overview.extract') }), u("div", { class: "values", children: [u("p", { class: "value", children: [u("span", { class: "label", children: t('overview.temperature_extract') }), overviewSignal.value?.TempExtract.toFixed(1), u("span", { class: "units", children: " \u00B0C" })] }), u("p", { class: "value", children: [u("span", { class: "label", children: [t('overview.humidity_rel_extract'), " (rel)"] }), overviewSignal.value?.HumExtract, u("span", { class: "units", children: " %" })] }), u("p", { class: "value", children: [u("span", { class: "label", children: [t('overview.humidity_abs_extract'), " (abs)"] }), overviewSignal.value?.absHumExtract, u("span", { class: "units", children: [" g/m", u("sup", { children: "3" })] })] }), u("p", { class: "value", children: [u("span", { class: "label", children: ["CO", u("sub", { children: "2" }), !!overviewSignal.value?.NoCO2Sensor && u(CO2InfoButton, { className: "bm-co2-info-button" })] }), overviewSignal.value?.NoCO2Sensor ? "-" : overviewSignal.value?.CO2, u("span", { class: "units", children: " ppm" })] })] })] }), u("div", { class: "overview-type", children: [u("h3", { class: "name text-exhaust", children: t('overview.exhaust') }), u("div", { class: "values", children: u("p", { class: "value", children: [u("span", { class: "label", children: t('overview.temperature_exhaust') }), overviewSignal.value?.TempExhaust.toFixed(1), u("span", { class: "units", children: " \u00B0C" })] }) })] })] })] })] });
    }

    function ErrorMessage() {
        const { t } = useTranslation();
        return u("div", { children: [u("p", { class: "form-label", children: t('key.problem') }), u("span", { class: "rot", children: serverMessageSignal.value })] });
    }
    function Form() {
        const { t } = useTranslation();
        const [showPassword, setShowPassword] = d$1(false);
        return u("form", { method: "post", children: [u("p", { class: "form-label", children: t('key.label') }), u("div", { class: "form-group", children: [u("input", { class: "form-control", required: true, type: showPassword ? "text" : "password", name: "serial_password" }), u("span", { class: "show-pwd", children: u("a", { onClick: _ => setShowPassword(!showPassword), children: showPassword ? t('key.pwd_hide') : t('key.pwd_show') }) }), u("br", {}), serverMessageSignal.value && u("span", { class: "rot", children: serverMessageSignal.value })] }), u("button", { type: "submit", class: "btn btn-primary btn-block", children: t('key.submit') })] });
    }
    function LoginPopup() {
        let setShow = (val) => {
            loginSignal.value = val;
        };
        return u(Popup, { setShow: setShow, className: "white narrow", clickBackground: false, children: [!inputActiveSignal.value && u(ErrorMessage, {}), !!inputActiveSignal.value && u(Form, {})] });
    }
    function Login() {
        return u(k$1, { children: loginSignal.value && u(LoginPopup, {}) });
    }

    G$1(u(Overview, {}), document.getElementById("nav1"));
    G$1(u(Login, {}), document.getElementById("login"));

    // mapping between programs and translation strings
    const programs = new Map([
        [0, "min_vent_short"],
        [1, "hr_rel_short"],
        [2, "hr_abs_short"],
        [3, "cooling_short"],
        [4, "co2_short"],
        [5, "water_ins_short"],
        [6, "out_temp_short"],
        [7, "hum_ins_short"],
    ]);
    const operatingmodes = new Map([
        [0, "cmf"],
        [1, "cmf"],
        [2, "slp"],
        [3, "trb"],
        [4, "trc"],
        [5, "srv"],
        [6, "tst"],
        [7, "mnu"],
    ]);

    G$1(u(MinuteTable, {}), document.getElementById("nav4"));
    function getErrorFromState(state) {
        const { i18n } = useTranslation();
        console.log(i18n.language);
        if (((state == 0) || (state == "0")) || ((state == 22) || (state == "22"))) {
            return "OK";
        }
        else {
            if (errorSignal.value) {
                return errorSignal.value[i18n.language].short;
            }
            return "";
        }
    }
    function OperatingMode({ state, humRed }) {
        const { t } = useTranslation();
        if (humRed) {
            return u(k$1, { children: t('states.hrd.short') });
        }
        else {
            return u(k$1, { children: t('states.' + operatingmodes.get(state) + '.short') });
        }
    }
    function Program({ state, controlAuto }) {
        const { t } = useTranslation();
        if (controlAuto != undefined && (state == 0 || state == 1)) {
            return u(k$1, { children: t('program.' + programs.get(controlAuto)) });
        }
        else {
            return u(k$1, {});
        }
    }
    function Table() {
        const { t } = useTranslation();
        return u("table", { id: "table", class: "table", children: u("tbody", { children: [u("tr", { children: [u("th", { children: t('PL.TIM') }), u("td", { children: t('PL.timestamp') }), u("td", { children: parseTimestamp$1(overviewSignal.value.timestamp, true) })] }), u("tr", { children: [u("th", { children: t('PL.OM') }), u("td", { children: t('PL.operating_mode') }), u("td", { children: u(OperatingMode, { state: overviewSignal.value.State, humRed: overviewSignal.value.HumRedMode }) })] }), u("tr", { children: [u("th", { children: "PRG" }), u("td", { children: t('PL.program') }), u("td", { children: u(Program, { state: overviewSignal.value.State, controlAuto: overviewSignal.value.ControlAuto }) })] }), u("tr", { children: [u("th", { children: "RED" }), u("td", { children: [t('PL.reduction'), " (mini)"] }), u("td", { children: u(Program, { state: overviewSignal.value.State, controlAuto: Math.floor(overviewSignal.value.ControlAuto / 5) ? overviewSignal.value.ControlAuto : undefined }) })] }), u("tr", { children: [u("th", { children: t('PL.HR') }), u("td", { children: t('PL.humidity_reduction') }), u("td", { children: overviewSignal.value.HumRedMode ? t('yes') : t('no') })] }), u("tr", { children: [u("th", { children: t('PL.SC') }), u("td", { children: t('PL.summer_cooling') }), u("td", { children: overviewSignal.value.bSumCooling != 0 ? t('yes') : t('no') })] }), u("tr", { children: [u("th", { children: "CL" }), u("td", { children: t('PL.comfort_level') }), u("td", { children: overviewSignal.value.ComfortLevel })] }), u("tr", { children: [u("th", { children: [t('PL.RA'), " [m", u("sup", { children: "2" }), "]"] }), u("td", { children: t('PL.room_area') }), u("td", { children: overviewSignal.value.RoomArea })] }), u("tr", { children: [u("th", { children: u("span", { children: ["2A [m", u("sup", { children: "3" }), "/h]"] }) }), u("td", { children: t('PL.2nd_room_adapter') }), u("td", { children: overviewSignal.value.SecondRoomFlow })] }), u("tr", { children: [u("th", { children: [t('PL.FSS'), " [1/min]"] }), u("td", { children: t('PL.fan_speed_supply') }), u("td", { children: overviewSignal.value.FanSupplyRPM })] }), u("tr", { children: [u("th", { children: [t('PL.FSE'), " [1/min]"] }), u("td", { children: t('PL.fan_speed_extract') }), u("td", { children: overviewSignal.value.FanExtractRPM })] }), u("tr", { children: [u("th", { children: [t('PL.AFL'), " [m", u("sup", { children: "3" }), "/h]"] }), u("td", { children: t('PL.air_flow') }), u("td", { children: overviewSignal.value.AirFlow })] }), u("tr", { children: [u("th", { children: [t('PL.TET'), " [\u2103]"] }), u("td", { children: t('PL.extract_temperature') }), u("td", { children: overviewSignal.value.TempExtract.toFixed(1) })] }), u("tr", { children: [u("th", { children: [t('PL.HET'), " [%]"] }), u("td", { children: [t('PL.extract_humidity'), " (rel)"] }), u("td", { children: overviewSignal.value.HumExtract })] }), u("tr", { children: [u("th", { children: [t('PL.TOU'), " [\u2103]"] }), u("td", { children: t('PL.outdoor_temperature') }), u("td", { children: overviewSignal.value.TempOutdoor.toFixed(1) })] }), u("tr", { children: [u("th", { children: [t('PL.HOU'), " [%]"] }), u("td", { children: [t('PL.outdoor_humidity'), " (rel)"] }), u("td", { children: overviewSignal.value.HumOutdoor })] }), u("tr", { children: [u("th", { children: u("span", { children: ["CO", u("sub", { children: "2" }), " [ppm]"] }) }), u("td", { children: u("span", { children: ["CO", u("sub", { children: "2" })] }) }), u("td", { children: overviewSignal.value.CO2 })] }), u("tr", { children: [u("th", { children: [t('PL.TSU'), " [\u2103]"] }), u("td", { children: t('PL.supply_temperature_sens') }), u("td", { children: overviewSignal.value.TempSupply.toFixed(1) })] }), u("tr", { children: [u("th", { children: [t('PL.TSC'), " [\u2103]"] }), u("td", { children: t('PL.supply_temperature') }), u("td", { children: overviewSignal.value.TempVirtSupExit.toFixed(1) })] }), u("tr", { children: [u("th", { children: [t('PL.TEH'), " [\u2103]"] }), u("td", { children: t('PL.exhaust_temperature') }), u("td", { children: overviewSignal.value.TempExhaust.toFixed(1) })] }), u("tr", { children: [u("th", { children: [t('PL.APR'), " [hPa]"] }), u("td", { children: t('PL.air_pressure') }), u("td", { children: overviewSignal.value.Pressure })] }), u("tr", { children: [u("th", { children: [t('PL.ADY'), " [kg/m", u("sup", { children: "3" }), "]"] }), u("td", { children: t('PL.air_density') }), u("td", { children: overviewSignal.value.airDensity })] }), u("tr", { children: [u("th", { children: [t('PL.HRP'), " [%]"] }), u("td", { children: [t('PL.heat_recovery_rel'), u("span", { children: " (rel)" })] }), u("td", { children: getHeatRecoveryPercentage(overviewSignal.value) })] }), u("tr", { children: [u("th", { children: [t('PL.HRW'), " [W]"] }), u("td", { children: [t('PL.heat_recovery_abs'), u("span", { children: " (abs)" })] }), u("td", { children: getPowerRecovery(overviewSignal.value) })] }), u("tr", { children: [u("th", { children: [t('PL.OPH'), " [h]"] }), u("td", { children: t('PL.operating_hours') }), u("td", { children: overviewSignal.value.operating_hours })] }), u("tr", { children: [u("th", { children: [t('PL.FIH'), " [h]"] }), u("td", { children: t('PL.filter_hours') }), u("td", { children: overviewSignal.value.filter_hours })] }), u("tr", { children: [u("th", { children: "SNR" }), u("td", { children: t('PL.serial_number') }), u("td", { children: deviceInfoSignal.value.SRN_name })] }), u("tr", { children: [u("th", { children: "RSSI [dBm]" }), u("td", { children: t('PL.RSSI_value') }), u("td", { children: overviewSignal.value.RSSI })] }), u("tr", { children: [u("th", { children: t('PL.ES') }), u("td", { children: t('PL.error_state') }), u("td", { children: getErrorFromState(overviewSignal.value.ErrorState) })] }), u("tr", { children: [u("th", { children: "EFN" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.ErrorFileNr })] }), u("tr", { children: [u("th", { children: "ELN" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.ErrorLineNr })] }), u("tr", { children: [u("th", { children: "ECO" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.ErrorCode })] }), u("tr", { children: [u("th", { children: "VPE" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.VentPosExtract })] }), u("tr", { children: [u("th", { children: "VBY" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.VentPosBypass })] }), u("tr", { children: [u("th", { children: "VBA" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.VentPosBath })] }), u("tr", { children: [u("th", { children: "VPS" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.VentPosSupply })] }), u("tr", { children: [u("th", { children: "TPE" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.CtrlSetExtVent })] }), u("tr", { children: [u("th", { children: "TBY" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.CtrlSetBypVent })] }), u("tr", { children: [u("th", { children: "TBA" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.CtrlSet2ndVent })] }), u("tr", { children: [u("th", { children: "TPS" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.CtrlSetSupVent })] }), u("tr", { children: [u("th", { children: "FSF" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.FilterSupplyFul })] }), u("tr", { children: [u("th", { children: "FEF" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.FilterExtractFul })] }), u("tr", { children: [u("th", { children: "DIP" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.DIPSwitch })] }), u("tr", { children: [u("th", { children: "ZKL" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.FSC })] }), u("tr", { children: [u("th", { children: "AKL" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.FEC })] }), u("tr", { children: [u("th", { children: "LKA" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.CSU })] }), u("tr", { children: [u("th", { children: "LKF" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.CFA })] }), u("tr", { children: [u("th", { children: "S1" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.S1 })] }), u("tr", { children: [u("th", { children: "S2" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.S2 })] }), u("tr", { children: [u("th", { children: "S3" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.S3 })] }), u("tr", { children: [u("th", { children: "S4" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.S4 })] }), u("tr", { children: [u("th", { children: "S5" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.S5 })] }), u("tr", { children: [u("th", { children: "S6" }), u("td", { children: "--" }), u("td", { children: overviewSignal.value.S6 })] })] }) });
    }
    function MinuteTable() {
        const { t } = useTranslation();
        return u("div", { class: "container minute-tab", children: u("div", { class: "row", children: u("div", { class: "col-sm-6 col-md-5 col-md-offset-1 col-xs-12", children: [overviewSignal.value && u(Table, {}), !overviewSignal.value && u("div", { children: "keine Werte vorhanden" })] }) }) });
    }

    function helpDiag() {

        for (let i = 0; i < $diagramList.length; i++)
        {
            let id = 'DG_' + $diagramList[i][0];
            if (document.getElementById(id) != null)
            {
                $("#DG_" + $diagramList[i][0]).click(function() 
                {
                    // this function will get executed every time the #home element is clicked (or tab-spacebar changed)
                    checkForUnitCompatibility();
                });
            }
        }
        // dont know what this means:
        //TODOW 8691 + 8743 in Chart.js

        // from chartOnload, should work in this function.
        myOnLoad(false);
    	document.getElementById("DG_month_val").checked = true;
    }

    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations()
            .then(function (registrations) {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    }

    start();
    getData();
    script();
    logout();
    MyScrollBar2();
    helpDiag();

    exports.$chosenUnits = $chosenUnits$1;
    exports.$diagramList = $diagramList;
    exports.$secLogHeader = $secLogHeader$1;
    exports.DEFAULT_LANG_NAME = DEFAULT_LANG_NAME;
    exports.DG_DAYS_100 = DG_DAYS_100$1;
    exports.DG_DAYS_30 = DG_DAYS_30$1;
    exports.DG_DAYS_AND_MONTHS = DG_DAYS_AND_MONTHS;
    exports.DG_MONTHS = DG_MONTHS$1;
    exports.HIDE = HIDE$1;
    exports.MAGIC_WORD_TRANSLATION = MAGIC_WORD_TRANSLATION;
    exports.MyScrollBar2 = MyScrollBar2;
    exports.PLAUSI_AIR_MAX = PLAUSI_AIR_MAX$1;
    exports.PLAUSI_AIR_MIN = PLAUSI_AIR_MIN$1;
    exports.PLAUSI_CO2_MAX = PLAUSI_CO2_MAX;
    exports.PLAUSI_CO2_MIN = PLAUSI_CO2_MIN;
    exports.PLAUSI_HUM_MAX = PLAUSI_HUM_MAX$1;
    exports.PLAUSI_HUM_MIN = PLAUSI_HUM_MIN$1;
    exports.PLAUSI_TEMP_MAX = PLAUSI_TEMP_MAX$1;
    exports.PLAUSI_TEMP_MIN = PLAUSI_TEMP_MIN$1;
    exports.PLAUSI_WRP_MAX = PLAUSI_WRP_MAX$1;
    exports.PLAUSI_WRP_MIN = PLAUSI_WRP_MIN$1;
    exports.PRIM_LOG_PLACE_1 = PRIM_LOG_PLACE_1;
    exports.PRIM_LOG_PLACE_2 = PRIM_LOG_PLACE_2;
    exports.PRIM_LOG_PLACE_3 = PRIM_LOG_PLACE_3;
    exports.PRIM_LOG_PLACE_4 = PRIM_LOG_PLACE_4;
    exports.SHOW = SHOW$1;
    exports.SRN_RELOAD = SRN_RELOAD;
    exports.SerNrInfoHide = SerNrInfoHide;
    exports.TRANS_SECLOG = TRANS_SECLOG;
    exports.blobsArray = blobsArray;
    exports.buttonDiagInputHide = buttonDiagInputHide;
    exports.buttonDiagLogTypeHide = buttonDiagLogTypeHide;
    exports.buttonFuncHide = buttonFuncHide;
    exports.byteToBits = byteToBits;
    exports.bytesToString = bytesToString;
    exports.changeDiagInput = changeDiagInput;
    exports.changeLogType = changeLogType;
    exports.checkForCrypt256 = checkForCrypt256;
    exports.checkForUnitCompatibility = checkForUnitCompatibility;
    exports.checkPlausi = checkPlausi$1;
    exports.checkPlausiPrimBlob = checkPlausiPrimBlob$1;
    exports.checkPlausiSecBlob = checkPlausiSecBlob$1;
    exports.chjs = chjs;
    exports.clear_key = clear_key;
    exports.connectFormat = connectFormat;
    exports.correctVersion = correctVersion;
    exports.countEne = countEne;
    exports.createPrimBlobObject = createPrimBlobObject;
    exports.createSecLogObject = createSecLogObject$1;
    exports.decodeBlobFromAES = decodeBlobFromAES;
    exports.decodeBlobFromAES_256 = decodeBlobFromAES_256;
    exports.decodeFromBase64 = decodeFromBase64$1;
    exports.deleteEmptyTabSpace = deleteEmptyTabSpace$1;
    exports.divideByte = divideByte;
    exports.editKeyPopup = editKeyPopup;
    exports.encodeInBase64 = encodeInBase64;
    exports.fillDetails = fillDetails;
    exports.fillErrorText = fillErrorText;
    exports.fillLangBefore = fillLangBefore;
    exports.fillSecTab = fillSecTab$1;
    exports.getAbsHum = getAbsHum;
    exports.getAirDensity = getAirDensity;
    exports.getDataAjax = getDataAjax;
    exports.getKeyName = getKeyName;
    exports.getLang = getLang;
    exports.getLangNow = getLangNow;
    exports.getNameFrSNRname = getNameFrSNRname;
    exports.getNumberFrBits = getNumberFrBits;
    exports.getPressure = getPressure;
    exports.getRoomArea = getRoomArea;
    exports.getSNR = getSNR$1;
    exports.getSRN_name = getSRN_name;
    exports.getSecLogObject = getSecLogObject$1;
    exports.getSecLogTrans = getSecLogTrans;
    exports.getSecondRoomFlow = getSecondRoomFlow;
    exports.handlePopup = handlePopup;
    exports.handleSpecialCharactersBack = handleSpecialCharactersBack;
    exports.hasClass = hasClass;
    exports.hideP = hideP$1;
    exports.hidePwd = hidePwd$1;
    exports.inputActiveSignal = inputActiveSignal;
    exports.keyEditHide = keyEditHide;
    exports.langs = langs;
    exports.lineChartData = lineChartData;
    exports.log_array = log_array$1;
    exports.loginSignal = loginSignal;
    exports.lowPlusHigh = lowPlusHigh;
    exports.makeHeatRecoveryVisible = makeHeatRecoveryVisible;
    exports.mapUnits = mapUnits;
    exports.myOnLoad = myOnLoad;
    exports.noError = noError$1;
    exports.parseBlob = parseBlob;
    exports.parseDIP = parseDIP;
    exports.parseOneBlob = parseOneBlob$1;
    exports.parseTimestamp = parseTimestamp$1;
    exports.prepareForNoSecLog = prepareForNoSecLog$1;
    exports.prepareTextFromDB = prepareTextFromDB;
    exports.reinitScroll = reinitScroll$1;
    exports.roundVal = roundVal;
    exports.serverMessageSignal = serverMessageSignal;
    exports.setOMdetails = setOMdetails;
    exports.setProgramCheckbox = setProgramCheckbox;
    exports.setTextHrefPwd = setTextHrefPwd;
    exports.showPwd = showPwd;
    exports.stringToBytes = stringToBytes;
    exports.submitButtonBoth = submitButtonBoth;
    exports.submitDiagInput = submitDiagInput;
    exports.timestampForSecLog = timestampForSecLog$1;
    exports.toSigned = toSigned;

    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
