<?php
class Mysql{
	private $master;
	private $slave;
	public	$do_replication = false;
    function __construct( $master  ){
        $this->master = $master;
    }
    private function connect( $is_master = true ){
        if( $is_master ) $dbInfo = $this->master;
        else $dbInfo = $this->slave;
        if( !$db = mysql_connect( $dbInfo['host'] , $dbInfo['user'] , $dbInfo['passwd'] ) ){
            die('can\'t connect to mysql ' . $ $dbInfo['host']  );
        }else{
	       // mysql_query( "set names 'utf8'" , $db );
	        mysql_query( "set names 'utf8mb4'" , $db );
        }
        //echo 'connect to: '. $dbInfo['host'].'at db:'.$dbInfo['dbname'].'<br>';
        mysql_select_db( $dbInfo['dbname'] , $db );
        
        return $db;
    }  
    private function dbRead(){
        if( isset( $this->dbRead ) ){
            mysql_ping( $this->dbRead );
            return $this->dbRead;
        }else{
            if( !$this->do_replication ) return $this->dbWrite();
            else {
                $this->dbRead = $this->connect( false );
                return $this->dbRead;
            }
        }
    }
    
    private function dbWrite(){
        if( isset( $this->dbWrite ) ){
            mysql_ping( $this->dbWrite );
            return $this->dbWrite;
        }else{
            $this->dbWrite = $this->connect( true );
            return $this->dbWrite;
        }
    }
    public function setSlave( $slave ){
    
	    $this->slave['host'] = $slave['host'];
        $this->slave['user'] = isset($slave['user']) ? $slave['user'] : $this->master['user'];
        $this->slave['passwd'] = isset($slave['passwd']) ? $slave['passwd'] : $this->master['passwd'];
        $this->slave['dbname'] = isset($slave['dbname']) ? $slave['dbname'] : $this->master['dbname'];
        $this->do_replication = true;
    }
    public function saveError() {
        //$GLOBALS['MYSQL_LAST_ERROR'] = mysql_error();
        //$GLOBALS['MYSQL_LAST_ERRNO'] = mysql_errno();
        if( mysql_errno() ){
	          print_r(  mysql_error() );
        }
      
    }
    
    public function runSql( $sql ) {
        $ret = mysql_query( $sql , $this->dbWrite() );
        $this->saveError();
        return $ret;
    }
    public function getData( $sql , $key = NULL ){
        $GLOBALS['MYSQL_LAST_SQL'] = $sql;
        $data = Array();
        $i = 0;
        $result = mysql_query( $sql , $this->do_replication ? $this->dbRead() : $this->dbWrite()  );
        
        $this->saveError();

        while( $Array = mysql_fetch_array($result, MYSQL_ASSOC ) ){
        	if( $key && isset( $Array[$key] ) ){
	        	$data[$Array[$key]] = $Array;
        	}else{
	        	$data[$i++] = $Array;
        	}
        }

        /*
        if( mysql_errno() != 0 )
            echo mysql_error() .' ' . $sql;
        */
        
        mysql_free_result($result); 

        if( count( $data ) > 0 )
            return $data;
        else
            return false;    
    }
    
    public function getLine( $sql ){
        $data = $this->getData( $sql );
        return @reset($data);
    }
    
    public function getVar( $sql ){
        $data = $this->getLine( $sql );
        return $data[ @reset(@array_keys( $data )) ];
    }
    
    public function lastId(){
        $result = mysql_query( "SELECT LAST_INSERT_ID()" , $this->dbWrite() );
        return reset( mysql_fetch_array( $result, MYSQL_ASSOC ) );
    }
    
    public function closeDb(){
        if( isset( $this->dbRead ) ){
	         @mysql_close( $this->dbRead );
	         unset( $this->dbRead );
        }
        if( isset( $this->dbWrite ) ){
	        @mysql_close( $this->dbWrite );
	        unset( $this->dbWrite );
        }
    }
    
    public function escape( $str ){
        if( isset($this->dbRead)) $db = $this->dbRead ;
        elseif( isset($this->dbWrite) )    $db = $this->dbWrite;
        else $db = $this->dbRead();
        
        return mysql_real_escape_string( $str , $db );
    }
    
    public function errno(){
        return  $GLOBALS['MYSQL_LAST_ERRNO'];
    }
    
    public function error(){
        return $GLOBALS['MYSQL_LAST_ERROR'];
    }
}