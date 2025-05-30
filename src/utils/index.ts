export function filterObj (ary: any[] | null, key: string | number, value: string) {
  interface ob {
    [key: string]: string | number
  }
  let obj: ob = {}
  if (ary != null && ary.length > 0 && value !== '') {
    ary.forEach ((item) => {
      if (item[key] == value) {
        obj = item;
        return false;
      }
    });
  }
  return obj
}
export function filterObjGetIndex(ary: any[] | null, key:string, value:string) {
  var obj = -1;
  if (ary != null && ary.length > 0 && value != '') {
    ary.forEach((item, index) => {
      if (item[key] == value) {
        obj = index;
        return false;
      }
    });
  }
  return obj
}

//\n处理成换行
export function newline (content: any) {
  let string = content
  string = string.replace (/\n/g, "<br>");
  return string
}

export function formatObj(obj:any){
  return JSON.parse(JSON.stringify(obj))
}

export function downloadFile(data:any,name:string){
  const blob = new Blob([data]);
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = name ; // 设置下载文件名
  document.body.appendChild(link);
  link.click();
// 清理临时对象
  document.body.removeChild(link);
  URL.revokeObjectURL(fileUrl);
}
export function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes/1024).toFixed(2) + ' KB';
  if (bytes < 1073741824) return (bytes/1048576).toFixed(2) + ' MB';
  return (bytes/1073741824).toFixed(2) + ' GB';
}

//对话模型
export const aiVersion = [
  {
    label: 'Claude-3-5-sonnet-v2',
    value: 'bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0'
  },
  {
    label: 'OpenAI:GPT-4o-mini',
    value: 'openai:gpt-4o-mini'
  },
  {
    label: 'Claude-3-7-sonnet',
    value: 'anthropic:claude-3-7-sonnet-20250219'
  }
]
