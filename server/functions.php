<?php
session_start(); 
include_once('functions.php');

class DhpFile { 
        
        public static $directional_image="iVBORw0KGgoAAAANSUhEUgAAAfMAAABeCAIAAAC4mGqYAAAACXBIWXMAABcSAAAXEgFnn9JSAAAA";


		/**
		 *  Delete file function
		 * */
		 
		public static function deleteFile($file_path){
		if (!unlink($file_path))
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
							
				return false;
			}
					
		
		} 
		
		
		/**
		 *  This function process Uploads for DHIS
		 * */
		 
		public static function processUploadsForDHIS($target_file,$period,$orgUnit,$category){
			$csv_file = "../downloads/datavalueset.csv";
			$json_object = [];
				$file_handle = fopen($target_file, 'r');
				while (!feof($file_handle) ) {
					$line_of_text[] = fgetcsv($file_handle);
				}
				fclose($file_handle);
				
				//~ $available_fields = array('Foreword_Field','Acknowledgements_Field','Executive_Field','Mission_Field','Structure_Field','Facility_Field','Population_Field','Geography_Field','Transportation_Field','Education_Field','DataCollection_Field','KeyMessages_Field','HealthStatusOfPopulation_Field','Morbidity_Field','DistrictHealthStatus_Field','StatusOfHealthServiceDelivery_Field','VaccinationServices_Field','ReproductiveHealthServices_Field','InfectionDisease_Field','DistrictHealthServiceDelivery_Field','StatusOfDistrictHealthSystems_Field','HumanResourcesForHealth_Field','MedicinesDrugs_Field','Infrastructure_Field','DistrictHealthSystemConclusions_Field','Recommendations_Field');
				$available_fields = array('Foreword_Field','Acknowledgements_Field','Executive_Field','Mission_Field','Structure_Field','Facility_Field','Population_Field');
				$dataelements = array('cKRsMKICQez','edyxVWaBAhu','NL6LIVRNlFI','VuF0VIZMQsh','zunP9DXYltg','CXZmOyNVjSe','BP7gXfZfQrl');
				
				$file_extension = "";
				$file_name = "";
				$count = 0;
				foreach ($line_of_text[0] as $key => $value)
				{
					$field_value = $line_of_text[1][$key];
					if(substr($field_value, -4)==".pdf"){
						$file_extension = substr($field_value, -4);
						$file_name	=	substr($field_value, 0, strlen($field_value)-4);
						}
						
						
					if(strpos($value,'Field',0)>0){
						if(strpos($value,'ImageField')>=0){
						$key = array_search($value, $available_fields);
								
							if(strpos($field_value,"content here...")>0){
								
								}else{
							array_push($json_object,array($value=> $field_value.strpos($value,"content here...")));
								}
								
							}
								
						if(strpos($target_file,$file_name)>0){
					
						}
						
					
						}
					}
					
				//~ $period = "2013";
				//~ $orgUnit= "";
				//~ $category="";
				DhpFile::saveDataToCSVFile('report_container',$json_object,$available_fields,$period,$orgUnit,$category);
				DhpFile::send_CSV_To_Dhis($csv_file);
					return $json_object;
					
		}
		
		
		/**
		 *  This function creates temporary database table 
		 * */
		 
		public static function saveDataToCSVFile($table_name,$json_object,$available_fields,$period,$orgUnit,$category){
			$csv_file = "../downloads/datavalueset.csv";
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
					DhpFile::deleteFile($csv_file);			   				
						
			}
			
			$file = fopen($csv_file,"w");
			
			$countTitle = 0;
			$Headers = array('dataelement','period','orgunit','categoryoptioncombo','attributeoptioncombo','value');//,'storedby','lastupdated','comment','followup');
			$available_fields = array('Foreword_Field','Acknowledgements_Field','Executive_Field','Mission_Field','Structure_Field','Facility_Field','Population_Field');
			$dataelements = array('cKRsMKICQez','edyxVWaBAhu','NL6LIVRNlFI','VuF0VIZMQsh','zunP9DXYltg','CXZmOyNVjSe','BP7gXfZfQrl');
				
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
			//~ $period="2013";
			$orgUnit = "at6UHUQatSo";
			$category = "bRowv6yZOF2";
			$attributeoptioncombo = "bRowv6yZOF2";
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
			
			
				//~ DhpFile::dropTemporalyTable($table_name);
					
				// Create connection
				$conn = new mysqli("localhost", "root", "","dhp_portal_demonstration");
				// Check connection
				if ($conn->connect_error) {
					die("Connection failed: " . $conn->connect_error);
				} 
				$query_string = "";
				foreach($available_fields as $field){
					$query_string .= $field." VARCHAR(30) NOT NULL,";
				}
				
					$sqlCommand = "CREATE TABLE ".$table_name." ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, district VARCHAR(30) NOT NULL, period VARCHAR(30) NOT NULL, ".$query_string." reg_date TIMESTAMP )";
						
					if ($conn->query($sqlCommand) === TRUE) {
					//~ echo "Table ".$table_name." created successfully";
						} else {
					echo "Error creating table: " . $conn->error;
					
					}

				$conn->close();
				
				
			
			}
		
		/**
		 *  Drop temporary database table 
		 * */
		 
		public static function dropTemporalyTable($table_name){
			
					
				// Create connection
				$conn = new mysqli("localhost", "root", "","dhp_portal_demonstration");
				// Check connection
				if ($conn->connect_error) {
					die("Connection failed: " . $conn->connect_error);
				} 
				
					$sqlCommand = "DROP TABLE IF EXISTS ".$table_name;
						
					if ($conn->query($sqlCommand) === TRUE) {
					//~ echo "Table ".$table_name." deleted successfully";
						} else {
					echo "Error deleting table: " . $conn->error;
					}

				$conn->close();
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
			//curl --data-binary @datavalueset.csv "https://apps.dhis2.org/demo/api/dataValueSets" -H "Content-Type:application/csv" -u admin:district -v
			
						$old_path = getcwd();
						//~ chdir('/my/path/');
						$output = shell_exec('curl --data-binary @'.$csv_file.' "https://apps.dhis2.org/demo/api/dataValueSets" -H "Content-Type:application/csv" -u admin:district -v');
						//~ chdir($old_path);
						$output = shell_exec('./script.sh var1 var2');
						echo "<pre>$output</pre>";
			
			die();
			
			
			//~ $request = curl_init("https://apps.dhis2.org/demo/api/dataValueSets");
			//~ 
			//~ // check if curl is enable for request to dhis server
						//~ if(is_callable('curl_init')){
						   //~ echo "Enabled";
						   //~ 
						   //~ // send a file
							//~ curl_setopt($request, CURLOPT_POST, true);
							//~ curl_setopt(
								//~ $request,
								//~ CURLOPT_POSTFIELDS,
								//~ array(
								  //~ 'file' => '@' . realpath($csv_file)
								  //~ . ';type=Content-Type:application/csv'
								  //~ . ';username=admin'
								  //~ . ';password=district'
								//~ ));
//~ 
							//~ // output the response
							//~ curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
							//~ if(!curl_exec($request)){
								//~ die('Error: "' . curl_error($request) . '" - Code: ' . curl_errno($request));
							//~ }
//~ 
							//~ // close the session
							//~ curl_close($request);
						   
						//~ }
						//~ else
						//~ {
						   //~ echo "Not enabled";
						//~ }
					
					//print_r($request);die();
			
			} 
} 

$dhp = new DhpFile;
?>
