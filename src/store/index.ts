import {useWebSocketStore} from './modules/webSocket'
import {useMenuStore} from './modules/useMenu'
import {useWorkspaceStore} from "@/store/modules/workspace";
import {useAgentStore} from '@/store/modules/agent'
const useStore = () => ({
	webSocket:useWebSocketStore(),
	useMenu:useMenuStore(),
	useWorkspace:useWorkspaceStore(),
	useAgent:useAgentStore(),
})

export default useStore
