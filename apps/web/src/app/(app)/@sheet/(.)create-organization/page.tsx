import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content';
import { SaveOrganizationForm } from '../../create-organization/save-organization-form';

export default function CreateOrganizationPage() {
	return (
		<Sheet defaultOpen>
			<InterceptedSheetContent>
				<SheetHeader>
					<SheetTitle>Create Organization</SheetTitle>
				</SheetHeader>

				<div className="py-4">
					<SaveOrganizationForm />
				</div>
			</InterceptedSheetContent>
		</Sheet>
	);
}
