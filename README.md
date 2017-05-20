# audio
this is audio for H5
*--DOM结构-------------------------------------------------------------
*<!-- 音频播放器 start -->
*   <div class="audio">
*       <div class="progress" data-js="progress">
*           <div class="pre_bar" data-js="preBar"></div>
*           <div class="cur_bar" data-js="curBar">
*              <div class="slide_radio" data-js="drag"></div>
*           </div> 
*       </div>
*       <div class="time flex">
*           <div class="cur flex_item" data-js="curTime">00:00</div>
*           <div class="end flex_item" data-js="total">00:00</div>
*       </div>
*       <div class="control flex">
*           <div class="flex_item pre_case">
*               <div class="pre" data-js="pre"></div>
*           </div>
*           <div class="flex_middle">
*               <div class="play pause" data-js="play"></div>
*           </div>
*           <div class="flex_item next_case">
*               <div class="next" data-js="next"></div>
*           </div>
*       </div>
*   </div>
*   <audio id="audio" src="1234.m4a"></audio>
*   <!-- 音频播放器 end -->
*--JS调用------------------------------------------------------------- 
*new Audio({
*   //音频ID
*   id: "#audio",
*   //进度条两边间距（默认16px）
*   barPadding: 16,
*   //快进/退按钮宽度（默认20px）
*   dragWidth: 40,
*   //回调(e.type = "next" | "prev" | "end"),分别代表下一首,上一首,播放结束
*   callback: function(e){}
*})
*