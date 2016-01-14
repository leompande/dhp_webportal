<?php
session_start(); 
include_once('functions.php');

class DhpFile { 
        
        public static $directional_image="iVBORw0KGgoAAAANSUhEUgAAAfMAAABeCAIAAAC4mGqYAAAACXBIWXMAABcSAAAXEgFnn9JSAAAA";
        public static $dir = "../uploads/";

		/**
		 *  Delete file function
		 * */
		 
		public static function deleteFile($file_path){

		if (!unlink(DhpFile::$dir."/".$file_path))
		  {
		  return false;
		  }
		else
		  {
		  return true;
		  }
		
		}
		
		/**
		 *  File Uploads function 
		 * */
		 
		public static function uploadFile($file_path,$target_file){

		if (move_uploaded_file($file_path, $target_file)) {
			    return true;
			} else {
//            return false;
            echo move_uploaded_file($file_path, $target_file);
			}
					
		
		} 
		
		
		/**
		 *  This function process Uploads for DHIS
		 * */
		 
		public static function processUploadsForDHIS($target_file,$period,$orgUnit,$category,$attributeoptioncombo,$names,$uids){
			$csv_file = "/usr/share/nginx/html/dhpportal/downloads/datavalueset.csv";
			$json_object = [];
				$file_handle = fopen($target_file, 'r');
				while (!feof($file_handle) ) {
					$line_of_text[] = fgetcsv($file_handle);
				}

				fclose($file_handle);
				$dataelements = $uids;
                $available_fields = array();
                foreach(json_decode($names) as $index => $data_array){
                        $news_data_array = explode("_",$data_array);
                    if(sizeof($news_data_array)>3){
                        $available_fields[$index] = $news_data_array[sizeof($news_data_array)-2]."_".$news_data_array[sizeof($news_data_array)-1];
                    }else{
                        $available_fields[$index] = $news_data_array[sizeof($news_data_array)-1];
                    }
                }

				$file_extension = "";
				$file_name = "";
				$count = 0;
				foreach ($line_of_text[0] as $key => $value)
				{

					$field_value = $line_of_text[1][$key];
					if(substr($field_value, -4)==".pdf"){
						$file_extension = substr($field_value, -4);
						$file_name	    =	substr($field_value, 0, strlen($field_value)-4);
						}


//					if(!DhpFile::contains($value,'Page')){

							if(strpos($field_value,"content here...")>=0){
                                array_push($json_object,array($value=> ""));
								}else{
                                array_push($json_object,array($value=> $field_value));
								}

//						}else{
//                    }
					}

var_dump($json_object);
				DhpFile::saveDataToCSVFile('report_container',$json_object,$available_fields,$period,$available_fields,$dataelements,$orgUnit,$category,$attributeoptioncombo);
				DhpFile::send_CSV_To_Dhis($csv_file);
					return $json_object;
					
		}


    public static function contains($substring, $string) {
                    $pos = strripos($string, $substring);

                    if($pos === false) {
                        // string needle NOT found in haystack
                        return false;
                    }
                    else {
                        // string needle found in haystack
                        return true;
                    }

                }
		
		/**
		 *  This function creates temporary database table 
		 * */
		 
		public static function saveDataToCSVFile($table_name,$json_object,$available_fields,$period,$names,$uids,$orgUnit,$category,$attributeoptioncombo){
			$csv_file = "/usr/share/nginx/html/dhpportal/downloads/datavalueset.csv";
			$query_string = "";
			$csv_array = array();

			foreach($available_fields as $field){
				foreach($json_object as $json_value){
					if (array_key_exists($field, $json_value)) {
						$csv_array[$field] = $json_value[$field];
						}else{
							
							}
				}
				}

		    if (file_exists($csv_file)) {
                unlink($csv_file);
			}
            clearstatcache();
			$file = fopen($csv_file,"w");
			
			$countTitle = 0;
			$Headers = array('dataelement','period','orgunit','categoryoptioncombo','attributeoptioncombo','value');//,'storedby','lastupdated','comment','followup');

			$dataelements = $uids;
				
			$colCount = count($Headers);
			$headers = "";
			foreach ($Headers as $key => $line){
				$countTitle++;
				$headers.=$line;
				if($countTitle==$colCount){
					
					}else{
						$headers.=",";
						}
						  
			}
			fputcsv($file,explode(',',$headers));


			$forRows = 0;
			$rowsValues = "";
			$countRound=0;
			foreach ($csv_array as $key => $line){
				$colCounter = 0;
				foreach ($Headers as $key => $line2){
					
					
					if($colCounter==0){
						$rowsValues.=$dataelements[$countRound];
						}
						
					if($colCounter==1){
						$rowsValues.=$period;
						}
						
					if($colCounter==2){
						$rowsValues.=$orgUnit;
						}
						
					if($colCounter==3){
						$rowsValues.=$category;
						}
						
					if($colCounter==4){
						$rowsValues.=$attributeoptioncombo;
						}
						
					if($colCounter==5){
						$rowsValues.=$line;
						}
						
					if($colCounter==6){
						$rowsValues.="Admin";
						}
						
					if($colCounter==7){
						$rowsValues.="2015-11-10T07:12:31.774+0000";
						}
						
					if($colCounter==8){
						$rowsValues.="Uploaded From DHP Portal";
						}
						
					if($colCounter==9){
						$rowsValues.="FALSE";
						}
						
						
						$colCounter++;
					if($colCounter>=$colCount){
						fputcsv($file,explode(',',$rowsValues));
						$rowsValues="";
						$countRound++;
						$colCounter=0;
						}else{
						$rowsValues.=",";
							}
					
					}
						  
			}
			
			fclose($file); 
				
				return $csv_file;
			
			}
		
		/**
		 *  This function creates temporary database table 
		 * */
		 
		public static function createTemporalyTable($table_name,$available_fields){
			}
		
		/**
		 *  Drop temporary database table 
		 * */
		 
		public static function dropTemporalyTable($table_name){

			}
		
		public static function queryTheDatabase($table_name,$csv_file){
				
				$json_object = [];
				$file_handle = fopen($csv_file, 'r');
				while (!feof($file_handle) ) {
					$line_of_text[] = fgetcsv($file_handle);
				}
				fclose($file_handle);
				
				
				$file_extension = "";
				$file_name = "";
				$count = 0;
				foreach ($line_of_text as $key => $value)
				{
					return json_encode($value[0]);
				}
					
				
				
				
				
			}

		public static function send_CSV_To_Dhis($csv_file){
		                $old_path = getcwd();
						chdir('/usr/share/nginx/html/dhpportal/downloads/');
						$output = shell_exec('./pushdatavalue.sh');$new_path = getcwd();
						chdir($old_path);
//            echo $new_path;
//            echo " ->";
//            echo $old_path;
//            echo " ->";
//            echo $output;

			}

    public function getAppropiatePdfFiles(){

        $file_system = scandir(DhpFile::$dir);

        return $file_system;
    }
} 

$dhp = new DhpFile;
?>
