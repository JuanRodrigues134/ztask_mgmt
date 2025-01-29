sap.ui.define(
    [
        "com/my/zfapctaskmgmt/controller/BaseController",
        "com/my/zfapctaskmgmt/model/indexDbManager"
    ],
    function(BaseController,
	indexDbManager,) {
      "use strict";
  
      return BaseController.extend("com.my.zfapctaskmgmt.controller.App", {
        onInit() {
          indexDbManager.openDB();
        }
      });
    }
  );
  