<?php

class DhpFile { 
        
        public static $directional_image="iVBORw0KGgoAAAANSUhEUgAAAfMAAABeCAIAAAC4mGqYAAAACXBIWXMAABcSAAAXEgFnn9JSAAAA";

	
		
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
		
		public static function uploadFile($file_path,$target_file){
			
		if (move_uploaded_file($file_path, $target_file)) {
			return true;
			} else {			
							
				return false;
			}
					
		
		} 
		
		public static function processUploadsForDHIS($target_file){
			$json_object = [];
				$file_handle = fopen($target_file, 'r');
				while (!feof($file_handle) ) {
					$line_of_text[] = fgetcsv($file_handle);
				}
				fclose($file_handle);
				
				$available_fields = array('Foreword_Field','Acknowledgements_Field','Executive_Field','Mission_Field','Structure_Field','Facility_Field','Population_Field','Geography_Field','Transportation_Field','Education_Field','DataCollection_Field','KeyMessages_Field','HealthStatusOfPopulation_Field','Morbidity_Field','DistrictHealthStatus_Field','StatusOfHealthServiceDelivery_Field','VaccinationServices_Field','ReproductiveHealthServices_Field','InfectionDisease_Field','DistrictHealthServiceDelivery_Field','StatusOfDistrictHealthSystems_Field','HumanResourcesForHealth_Field','MedicinesDrugs_Field','Infrastructure_Field','DistrictHealthSystemConclusions_Field','Recommendations_Field','Cell1[0]','Cell1[1]','Cell1[2]','Cell1[3]','Cell1[4]','Cell1[5]','Cell1[6]','Cell1[7]','Cell1[8]','ImageField1[0]','OtherImage[0]','OtherCheck[0]','OtherImage[1]','OtherCheck[1]','ImageField1[1]','ImageField1[2]','ImageField1[3]','ImageField1[4]','ImageField1[5]','ImageField1[6]','ImageField1[7]','ImageField1[8]','ImageField1[9]','ImageField1[10]','ImageField1[11]','ImageField1[12]','ImageField1[13]','ImageField1[14]','ImageField1[15]','ImageField1[16]','ImageField1[17]','ImageField1[18]','ImageField1[19]','ImageField1[20]','ImageField1[21]');
				
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
								
						//~ if(strlen($field_value)!=9410){
							
							if(strpos($field_value,"content here...")>0){
								
								}else{
							array_push($json_object,array($value=> $field_value.strpos($value,"content here...")));
								}
								
							//~ }else{
								
							}
								
						if(strpos($target_file,$file_name)>0){
					
						}
						
					
						}
					}
					echo json_encode($json_object);
		}
} 

$dhp = new DhpFile;
?>
