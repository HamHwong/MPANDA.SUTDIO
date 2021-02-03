module.exports = {
  routers: {
    "msg": "操作成功",
    "code": 200,
    "data": [{
        name: "MyWorkspace",
        path: "/Myworkspace",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: {
          title: "工作台",
          icon: "dashboard",
          noCache: false
        },
        children: [{
          name: "myTask",
          path: "/mytask",
          hidden: false,
          component: "dashboard/MyTask",
          meta: {
            title: "我的任务",
            icon: "form",
            noCache: false
          }
        }, {
          name: "myApproval",
          path: "/myapproval",
          hidden: false,
          component: "dashboard/MyApproval",
          meta: {
            title: "我的审批",
            icon: "form",
            noCache: false
          }
        }]
      },
      {
        name: "Dealer",
        path: "/dealer",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: {
          title: "经销商管理",
          icon: "tree",
          noCache: false
        },
        children: [{
            name: "Dealer_List",
            path: "list",
            hidden: false,
            component: "dealer/list/index",
            meta: {
              title: "经销商列表",
              icon: "list",
              noCache: false
            }
          },
          {
            name: "Dealer_SelfDeclaration_List",
            path: "dealer_self_list",
            hidden: false,
            component: "dealer/unfinished/index",
            meta: {
              title: "自我申明表",
              icon: "form",
              noCache: false
            }
          },
          {
            name: "Dealer_SelfDeclaration_Form",
            path: "dealer_self_form",
            hidden: true,
            component: "dealerSelfDeclaration/form/index",
            meta: {
              title: "自我申明表详情",
              icon: "form",
              noCache: false
            }
          },
          {
            name: "Dealer_Authorization_List",
            path: "dealer_auth_list",
            component: "dealer/unfinished/index",
            hidden: false,
            meta: {
              title: "授权书列表",
              icon: "list",
              noCache: false
            }
          },
          {
            name: "Dealer_Authorization_Form",
            path: "dealer_auth_form",
            component: "dealerAuthorization/form/index",
            hidden: true,
            meta: {
              title: "授权详情",
              icon: "form",
              noCache: false
            }
          },
          {
            name: "Detail",
            path: "detail/:id",
            hidden: false,
            component: "dealer/detail/index",
            hidden: true,
            meta: {
              title: "经销商详情",
              icon: "logininfor",
              noCache: false,
            }
          }
        ]
      },
      {
        name: "AreaManagement",
        path: "/AreaManagement",
        hidden: false,
        component: "Layout",
        children: [{
          name: "areaManagement",
          path: "index",
          component: "dealer/unfinished/index",
          meta: {
            title: "区域管理",
            icon: "international"
          }
        }]
      },
      {
        name: "ProductsManagement",
        path: "/ProductsManagement",
        hidden: false,
        component: "Layout",
        children: [{
          name: "productsManagement",
          path: "index",
          component: "dealer/unfinished/index",
          meta: {
            title: "产品管理",
            icon: "shopping"
          }
        }]
      },
      {
        name: "TargetManagement",
        path: "/TargetManagement",
        hidden: false,
        component: "Layout",
        children: [{
          name: "targetManagement",
          path: "index",
          component: "dealer/unfinished/index",
          meta: {
            title: "指标管理",
            icon: "monitor"
          }
        }]
      },
      {
        name: "SalesManagement",
        path: "/SalesManagement",
        hidden: false,
        component: "Layout",
        meta: {
          title: "销售管理",
          icon: "monitor"
        },
        children: [{
          name: "salesManagement",
          path: "index",
          component: "dealer/unfinished/index",
          meta: {
            title: "销售人员管理",
            icon: "form"
          }
        }, {
          name: "Dept",
          path: "dept",
          hidden: false,
          component: "system/dept/index",
          meta: {
            title: "部门管理",
            icon: "cascader",
            noCache: false
          }
        }, {
          name: "Post",
          path: "post",
          hidden: false,
          component: "system/post/index",
          meta: {
            title: "岗位管理",
            icon: "tree",
            noCache: false
          }
        }]
      },
      {
        name: "ReportManagement",
        path: "/ReportManagement",
        hidden: false,
        component: "Layout",
        children: [{
          name: "reportManagement",
          path: "index",
          component: "dealer/unfinished/index",
          meta: {
            title: "报表",
            icon: "table"
          }
        }]
      },
      {
        name: "ProxyManagement",
        path: "/ProxyManagement",
        hidden: false,
        component: "Layout",
        children: [{
          name: "proxyManagement",
          path: "index",
          component: "dealer/unfinished/index",
          meta: {
            title: "我的代理",
            icon: "peoples"
          }
        }]
      },
      {
        name: "ModuleManagement",
        path: "/ModuleManagement",
        hidden: false,
        component: "Layout",
        children: [{
          name: "moduleManagement",
          path: "index",
          component: "dealer/unfinished/index",
          meta: {
            title: "模块管理",
            icon: "swagger"
          }
        }]
      },

      {
        name: "System",
        path: "/system",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: {
          title: "系统管理",
          icon: "system",
          noCache: false
        },
        children: [{
          name: "User",
          path: "user",
          hidden: false,
          component: "system/user/index",
          meta: {
            title: "用户管理",
            icon: "user",
            noCache: false
          }
        }, {
          name: "Role",
          path: "role",
          hidden: false,
          component: "system/role/index",
          meta: {
            title: "角色管理",
            icon: "peoples",
            noCache: false
          }
        }, {
          name: "Menu",
          path: "menu",
          hidden: false,
          component: "system/menu/index",
          meta: {
            title: "菜单管理",
            icon: "tree-table",
            noCache: false
          }
        }, {
          name: "Dict",
          path: "dict",
          hidden: false,
          component: "system/dict/index",
          meta: {
            title: "字典管理",
            icon: "dict",
            noCache: false
          }
        }, {
          name: "Config",
          path: "config",
          hidden: false,
          component: "system/config/index",
          meta: {
            title: "参数设置",
            icon: "edit",
            noCache: false
          }
        }, {
          name: "Notice",
          path: "notice",
          hidden: false,
          component: "system/notice/index",
          meta: {
            title: "通知公告",
            icon: "message",
            noCache: false
          }
        }, {
          name: "Log",
          path: "log",
          hidden: false,
          redirect: "noRedirect",
          component: "ParentView",
          alwaysShow: true,
          meta: {
            title: "日志管理",
            icon: "log",
            noCache: false
          },
          children: [{
            name: "Operlog",
            path: "operlog",
            hidden: false,
            component: "monitor/operlog/index",
            meta: {
              title: "操作日志",
              icon: "form",
              noCache: false
            }
          }, {
            name: "Logininfor",
            path: "logininfor",
            hidden: false,
            component: "monitor/logininfor/index",
            meta: {
              title: "登录日志",
              icon: "logininfor",
              noCache: false
            }
          }]
        }]
      }
    ]
  }
}
