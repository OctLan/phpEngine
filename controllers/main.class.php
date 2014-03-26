<?php
class Main extends BaseController{
	public function enter(){
		echo '<br/><br/><br/><br/>';
		echo 'isAjax:'.isAjax();
		echo Url::getMethod();
		echo Url::$url;
		$this->render();
	}
	public function test(){
		print_r( $_REQUEST );
		echo 'isAjax:'.isAjax();
		return;
	}
}