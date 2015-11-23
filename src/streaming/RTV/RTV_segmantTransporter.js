/* author: Pavel Goldin
 * RTV object and methods to transfer over segment data from MPD to segment binary
 */

//console.log("@@@@@@@@@@@@@@====---- INITIATING RTVDASH ----==== @@@@@@@@@@@@@@@@@@@");


var RTVDash = {
        manifestSegments:[],
        //chunk:[],
        //logger:[],
        time:0,
        index:0,

        setBoxes:function(data, index, time, url){
              if ( !data ) return null;
              RTVDash.time = time;
              RTVDash.index = index;
              var parsedFile = ISOBoxerRTV.parseBuffer( data );
              return;
        },

        uInt64Arr : function( numInt ){
          var retArr = [];
          if( ( numInt - 0xffffffff ) < 0 ){
            retArr.push( 0 );
            retArr.push( numInt );
          }else{
            retArr.push( numInt - 0xffffffff );
            retArr.push( 0xffffffff );
          }
          return retArr;
        },

        getTime:function (){
          return function( obj, raw ){ //url : url, select : start or end
            var segArr = RTVDash.manifestSegments,
                i = 0,
                retObj = NaN;

            for( i = 0; i < segArr.length; i++ ){

                if ( obj.url.indexOf( segArr[i].segName ) !== -1 ){
                  switch ( obj.select ) {
                    case "start":
                      if( raw ){
                          retObj = segArr[i].segStartTime;
                      }else{
                          retObj = segArr[i].segStartTime/segArr[i].timescale;
                      }
                      break;

                    case "end":
                      if( raw ){
                        retObj = segArr[i].segEndTime;
                      }else{
                        retObj = segArr[i].segEndTime/segArr[i].timescale;
                      }
                      break;
                  }
                }
            }
            return retObj;
          };
        },

        requestIndex : function( segUrl ){
          var segArr = RTVDash.manifestSegments,
              i = 0,
              segIndex = NaN;
          for( i = 0; i < segArr.length; i++ ){

            if ( segUrl.indexOf( segArr[i].segName ) !== -1 ){
              segIndex = segArr[i].segIndex;
              break;
            }

          }
          return segIndex;
        }
    };
