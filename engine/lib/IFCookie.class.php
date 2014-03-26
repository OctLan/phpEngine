<?php
class IFCookie{
	const	SESSIONSTR = 'SID';
	public static function isNeedFix(){
		$agent = $_SERVER['HTTP_USER_AGENT'];
		if( strpos($agent,"iPhone") || strpos($agent,"Safari")  ){
			return true;
		}
		return false;
	}
	public static function fix(){
		$pre = $_REQUEST[Url::SHORT_CLASS_TAG] == 'callback'?'state':self::SESSIONSTR;
		if( isset( $_REQUEST[$pre] ) && $_REQUEST[$pre] && self::isNeedFix() ){
			$sid = $_REQUEST[$pre];
			session_id( $sid );
			Url::$custom[self::SESSIONSTR] = $sid;
		}
	}
}