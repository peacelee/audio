/*
 *
 * 音频播放器
 * @author: liping
 * @version: 1.0 2017-5-20
 * @params: id 
 * @params: barPadding [16px(默认)]
 * @params: dragWidth [20px(默认)]
 * @paprams: callback: function(e){} //回调(e.type = "next" | "prev" | "end"),分别代表下一首,上一首,播放结束
 *
*/

var Audio = function(options){

    //默认参数
    var opts = {
        $audio: $("#audio"),
        barPadding: 16,
        dragWidth: 40
    }

    //获取参数
    for (var i in options) {
        opts[i] = options[i]
    }

    //音频zepto Dom
    var $audio = opts.$audio;
    //音频DOm
    var audioDom = $audio[0];
    //缓冲进度
    var $preBar = $("[data-js=preBar]");
    //播放进度
    var $curBar = $("[data-js=curBar]");
    //进度条
    var $progress = $("[data-js=progress]");
    //滑动按钮
    var $drag = $("[data-js=drag]");
    //下一首按钮
    var $next = $("[data-js=next]");
    //上一首按钮
    var $prev = $("[data-js=prev]");
    //播放、暂停按钮
    var $play = $("[data-js=play]");
    //总时长
    var $totalTime = $("[data-js=total]");
    //当前时长
    var $curTime = $("[data-js=curTime]");

    //快进、退时控制器
    var flag = 0;
    //音频总时长
    var duration;
    //缓冲定时器
    var setBuffer;
    //活动结束的时间
    var audioCurTime;
    //进度条的宽度
    var barWith = $progress.width();

    //初始化
    function init(){

        //当前帧的数据已加载
        $audio.on("loadeddata", function() {
            //获取总时长
            var audioDuration = audioDom.duration;
            //如果获取总时长失败，则再次获取
            if(audioDuration>1){
                duration = audioDuration;
                addTotalTime(duration);
            }else{
                getDuration()
            }
        });

        //缓冲进度条
        setBuffer = setInterval(function() {
            buffer()
        }, 250)

        //播放进度条
        $audio.on("timeupdate", function() {
            progress()
        });

        //滑动快进、退 事件监听
        addListenTouch();

        //播放、暂停
        $play.on("click", function() {
            if($play.hasClass("pause")){
                $play.removeClass("pause");
                play()
            }else{
                $play.addClass("pause");
                pause()
            }
        })

        //下一首回调
        $next.on("click", function(){
            if (opts.callback) {
                opts.callback({type: "next"})
            }
        })

        //上一首回调
        $prev.on("click", function(){
            if (opts.callback) {
                opts.callback({type: "prev"})
            }
        })
    }
    init()

    //获取总时长
    function getDuration(){
        play();
        return setTimeout(function(){
            pause();
            //添加总时间
            addTotalTime(duration);
            return audioDom.duration;
        },250);
    }

    //监听缓冲数据
    function buffer() {
        try {
            //缓冲时间
            var buffered = audioDom.buffered;
            var preDone = buffered.end(buffered.length - 1);
            //缓冲宽度（%）
            var preWidth = progressWith(preDone, duration);
            //展示缓冲条进度
            showProgress($preBar, preWidth);
            //如果缓冲结束，则清除定时器
            if (preDone == duration) {
                clearInterval(setBuffer)
            }
        }catch (err){

        }
    }

    //播放进度
    function progress(){
        //快进、退时退出
        if(flag) return;
        //获取当前时间
        var curTime = audioDom.currentTime;
        //展示播放时间
        updateCurTime(curTime);
        //当前进度百分比
        var playDone = progressWith(curTime, duration);
        //展示播放进度
        showProgress($curBar, playDone);
        //播放结束回调
        if(curTime == duration){
            $play.addClass("pause");
            if(opts.callback){
                opts.callback({type: "end"})
            }
        }
    }
    
    //进度条显示
    function showProgress(dom, width){
        dom.css({"width": width})
    }

    //进度条占比
    function progressWith(cur, total){
        return (cur/total*100).toFixed(4)+"%";
    }

    //播放
    function play(){
        audioDom.play()
    }

    //暂停
    function pause(){
        audioDom.pause()
    }

    //添加总时长
    function addTotalTime(time) {
        $totalTime.html(formateTime(time));
    }

    //更新当前时间
    function updateCurTime(time) {
        $curTime.html(formateTime(time));
    }

    //处理时间
    function formateTime(time) {
        if(isNaN(time)) return;
        var min = handle(parseInt(time / 60));
        var sec = handle(parseInt(time % 60));
        function handle(t) {
            if (t < 10) {
                return "0" + t
            } else {
                return t
            }
        }
        return min + ":" + sec
    }

    //监听事件
    function addListenTouch() {
        $drag.on("touchstart", function(e) {
            e.stopPropagation();
        });
        $drag.on("touchmove", function(e) {
            e.stopPropagation();
            touchMove(e)
        });
        $drag.on("touchend", function(e) {
            e.stopPropagation();
            touchEnd()
        })
    }

    //进度条按钮触摸移动
    function touchMove(e) {

        //如果未获取到总时长，退出
        if (!duration) return;
        //滑动时，禁止播放进度
        flag = 1;
        //滑动占比
        var dragDone;
        //滑动是X轴坐标
        var move = e.touches[0].clientX;
        //进度条间距
        var barGap = opts.barPadding;
        if (move <= barGap) {
            audioCurTime = 0;
        } else if (move >= barWith + barGap) {
            audioCurTime = duration;
        } else {
            dragDone = progressWith(move - barGap, barWith);
            showProgress($curBar, dragDone);
            audioCurTime = (parseFloat(dragDone) * duration*0.01).toFixed(4);
        }
    }

    //进度条按钮触摸结束
    function touchEnd() {
        //如果未获取到总时长，退出
        if (!duration) return;
        //开放播放进度
        flag = 0;
        //当前时间
        audioDom.currentTime = audioCurTime;
    }

}