<?php
class BaseController{
	public $tplParams = array();
	public $layout = NULL;
	public $layoutTpl = true;
	function __construct(){
		//if token is expires clear it
		if( $_SESSION['expiresTime'] && $_SESSION['expiresTime']  <= time() ){
			$_SESSION = array();
		}
		if(isset($_GET['tokenString'])){
			$tokenString=explode(".", $_GET['tokenString']);
			$token= json_decode(base64_decode($tokenString[1]) , true );
		}
		if($token['oauth_token']){
			Weibo::init( c('akey') , c('skey') ,$tokenInfo['oauth_token'] );
			Weibo::setIp('202.110.0.5');
			$res = Weibo::show_user_by_id( $tokenInfo['user_id'] );
			if( $res && !isset( $res['error_code'] ) ){
				foreach ($res as $key => $value) {
					$_SESSION[$key] = $value;
				}
				$_SESSION['__SINA']['TOKEN'] = $tokenInfo['oauth_token'];
				$_SESSION['expiresTime'] = $tokenInfo['expires'] + time();
			}
		}else{
			Weibo::init( c('akey') , c('skey') ,$_SESSION['__SINA']['TOKEN'] );
			Weibo::setIp('202.110.0.5');
		}
		//init weibo Class
	}
	protected function _add( $key , $value = NULL ){
		if( $value == NULL && is_array($key) ){
			$this->tplParams += $key;
		}else{
			$this->tplParams[$key] = $value;		
		}
	}
	protected function showMessage( $message , $type = 'notice' , $show = true ){
		$message = '<message type="'.$type.'">'.$message.'</message>';
		if( $show ){
			echo $message;
		}else{
			return $message;	
		}
	}
	protected function render( $tplName = NULL , $data = array() ){
		if( $data && is_array( $data )  ){
			$data = array_merge( $data ,  $this->tplParams );
		}else{
			$data = $this->tplParams;
		}
		if( !$tplName ){
			$tpl = $tplName?$tplName:get_class($this);
			if( Url::getMethod() != c('default_method') ){
				$tpl .= '_'.Url::getMethod();
			}
		}else{
			$tpl = $tplName;
		}
		
		render( $data , $tpl , $this->layout , $this->layoutTpl );
	}
	protected function getAjax( $method , $extra = array() ){
		if( !method_exists(  $this , $method ) ) die('Ajax method is not exists' );
		//save  info
		$url = Url::getUrl();
		
		$extra['method'] = $method;
		$GLOBALS['__isAjax'] = true;
		
		Url::setUrl( Url::make($extra) );

		ob_start();
		$this->$method();
		$html = ob_get_clean();
		//replace back
		unset($GLOBALS['__isAjax']);
		Url::setUrl( $url );
		
		return $html;
	}
}