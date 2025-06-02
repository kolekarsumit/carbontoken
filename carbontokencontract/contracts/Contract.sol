// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract CarbonContract {
    address public myaddress = msg.sender;  // GOV Address (set during deployment)

    struct Company {
        string name;
        string industry_type;
        uint256 gov_id;
        string comp_address;
        address Address;
        uint256 allocatedcarbon;
        uint256 remaining;
    }

    struct Campaign {
        string name;
        string description;
        uint256 deadline;
        address takenBy; 
        bool isCompleted;
    }

    Campaign[] public campaigns; // List of all campaigns

    mapping(address => Company) private companies;
    address[] public companyAddresses;
    mapping(uint256 => bool) private govIdExists;
    mapping(uint256 => address) private govIdToAddress; 
    
    mapping(address => mapping(uint256 => uint256)) private yearMonthData; 
    mapping(address => uint256[]) private companyYearMonths; 

    // modifier onlyGov() {
    //     require(msg.sender == myaddress, "Only GOV can perform this action");
    //     _;
    // }

    // Add a company
    function add_company(
        string memory _name,
        string memory _industry,
        uint256 _gov_add,
        string memory _comp_add
    ) public payable {
        require(
            bytes(companies[msg.sender].name).length == 0,
            "Address Already registered"
        );
        require(
            !govIdExists[_gov_add],
            "GOV ID already corresponds to another company"
        );

        companyAddresses.push(msg.sender);
        govIdExists[_gov_add] = true;
        govIdToAddress[_gov_add] = msg.sender; 
        companies[msg.sender] = Company(_name, _industry, _gov_add, _comp_add, msg.sender, 0, 0);
    }

    // Get all companies
    function getAllCompany() public view returns (Company[] memory) {
        Company[] memory allcomp = new Company[](companyAddresses.length);

        for (uint256 i = 0; i < companyAddresses.length; i++) {
            address ad = companyAddresses[i];
            Company storage cmp = companies[ad];
            allcomp[i] = cmp;
        }
        return allcomp;
    }

    // Get my company using address
    function getmycompany(string memory _address) public view returns (Company memory) {
        address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not found for this GOV ID");

        return companies[companyAddress];
    }

    // Remove a company
    function remove_company(uint256 _gov_id) public {
        address companyAddress = govIdToAddress[_gov_id];
        require(companyAddress != address(0), "Company not found");

        require(msg.sender == companyAddress, "Only the company owner can remove it");

        govIdExists[_gov_id] = false;
        delete govIdToAddress[_gov_id];
        delete companies[companyAddress];

        for (uint256 i = 0; i < companyAddresses.length; i++) {
            if (companyAddresses[i] == companyAddress) {
                companyAddresses[i] = companyAddresses[companyAddresses.length - 1]; 
                companyAddresses.pop(); 
                break;
            }
        }
    }

    // Validate GOV ID against an address
    function validateGovId(uint256 _govId, string memory stringaddress) public view returns (bool) {
        address companyAddress = govIdToAddress[_govId];
        address converted_address=parseAddress(stringaddress);
        return companyAddress == converted_address;
    }

    function parseAddress(string memory _stringAddress) internal pure returns (address) {
        bytes memory addrBytes = bytes(_stringAddress);
        require(addrBytes.length == 42, "Invalid address length");
        require(addrBytes[0] == '0' && addrBytes[1] == 'x', "Address must start with 0x");

        uint160 addr = 0;
        for (uint256 i = 2; i < 42; i++) {
            uint160 char = uint160(uint8(addrBytes[i]));

            if (char >= 48 && char <= 57) {
                addr = addr * 16 + (char - 48);
            } else if (char >= 65 && char <= 70) {
                addr = addr * 16 + (char - 55);
            } else if (char >= 97 && char <= 102) {
                addr = addr * 16 + (char - 87);
            } else {
                revert("Invalid character in address");
            }
        }
        return address(addr);
    }

    function mycomp() public view returns(address) {
        return myaddress;
    }

    function storeYearMonthData(string memory _address, uint256 _yearMonth, uint256 _value) public {
        address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not registered for this GOV ID");
        require(yearMonthData[companyAddress][_yearMonth] == 0, "Year-month data already exists");
        require(companies[companyAddress].remaining >= _value, "Insufficient remaining carbon");

        companies[companyAddress].remaining -= _value;
        yearMonthData[companyAddress][_yearMonth] = _value;
        companyYearMonths[companyAddress].push(_yearMonth);
    }

    function getYearMonthData(string memory _address) public view returns (uint256[] memory, uint256[] memory) {
        address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not registered for this GOV ID");

        uint256 totalEntries = companyYearMonths[companyAddress].length;
        uint256[] memory yearMonths = new uint256[](totalEntries);
        uint256[] memory values = new uint256[](totalEntries);

        for (uint256 i = 0; i < totalEntries; i++) {
            uint256 yearMonth = companyYearMonths[companyAddress][i];
            yearMonths[i] = yearMonth;
            values[i] = yearMonthData[companyAddress][yearMonth];
        }

        return (yearMonths, values);
    }

    function getRemainingCarbon(string memory _address) public view returns (uint256) {
        address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not registered for this GOV ID");

        return companies[companyAddress].remaining;
    }

    function getAllocatedCarbon(string memory _address) public view returns (uint256) {
        address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not registered for this GOV ID");

        return companies[companyAddress].allocatedcarbon;
    }


    // GOV creates a new campaign
    function createCampaign(string memory _name, string memory _description, uint256 _deadline,string memory _address) public {
        address compAddress=parseAddress(_address);
        require(compAddress==0x68a6B62dEb244F2f1dF5Ca6Cbb0B8F6b1956A60D,"Only gov should create a new campaign");
        Campaign memory newCampaign = Campaign({
            name: _name,
            description: _description,
            deadline: _deadline,
            takenBy: address(0),
            isCompleted: false
        });

        campaigns.push(newCampaign);
    }

    // Any user can view all campaigns
    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    // Company can take a campaign if available
    function takeCampaign(uint256 _campaignId) public {
        require(_campaignId < campaigns.length, "Invalid campaign ID");

        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.takenBy == address(0), "Campaign already taken");
        require(!campaign.isCompleted, "Campaign already completed");
        require(bytes(companies[msg.sender].name).length != 0, "Only registered companies can take a campaign");

        campaign.takenBy = msg.sender;
    }
    // Function to mark a campaign as completed
function markCompleted(uint256 _campaignId) public {
    require(_campaignId < campaigns.length, "Invalid campaign ID");

    Campaign storage campaign = campaigns[_campaignId];

    require(campaign.takenBy != address(0), "Campaign not yet taken by any company");
    require(campaign.takenBy == msg.sender, "Only the company who took this campaign can mark it completed");
    require(!campaign.isCompleted, "Campaign already marked as completed");

    campaign.isCompleted = true;
}


// Function to update allocated carbon for a company
function updateAllocatedCarbon(uint256 _newAllocation, address _companyAddress,string memory _govAddress) public {

     address govAdd=parseAddress(_govAddress);
        require(govAdd==0x68a6B62dEb244F2f1dF5Ca6Cbb0B8F6b1956A60D,"Only GOV can update allocation");
    require(bytes(companies[_companyAddress].name).length != 0, "Company not registered");

    companies[_companyAddress].allocatedcarbon = _newAllocation;
    companies[_companyAddress].remaining = _newAllocation;
}


}
